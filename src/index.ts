#!/usr/bin/env node

// MCP server for SERCOP Open Data API
// Author: Andrés Villenas, Automayzer.ai
//
// This file implements a Model Context Protocol (MCP) server that proxies the SERCOP Open Data API of Ecuador.
// It exposes MCP tools for listing datasets, searching contracting processes, and retrieving process details by OCID.
//
// Tools:
// - list-datasets: Lists all available datasets from the SERCOP API.
// - search-processes: Searches contracting processes by keyword, year, and optional filters (buyer, supplier, page).
// - get-process-by-ocid: Retrieves a contracting process by its OCID identifier.
//
// Usage:
//   - Build: npx tsc
//   - Run: node build/index.js (or use the CLI if installed globally)
//
// References:
//   - Model Context Protocol: https://modelcontextprotocol.io/quickstart/server
//   - SERCOP Open Data API: https://datosabiertos.compraspublicas.gob.ec/PLATAFORMA/datos-abiertos/api

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = "https://datosabiertos.compraspublicas.gob.ec/PLATAFORMA/api";

const server = new McpServer({
  name: "sercop-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function fetchSercop<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return (await response.json()) as T;
  } catch (err) {
    console.error("SERCOP API error:", err);
    return null;
  }
}

// Tool: Search contracting processes by keyword
server.tool(
  "search-processes",
  "Search contracting processes by keyword, year, and optional filters (buyer, supplier, page)",
  {
    year: z.number().int().min(2015).describe("Year of the contracting process (e.g., 2015 to current year)"),
    search: z.string().min(3).describe("Keyword to search (at least 3 characters)"),
    page: z.number().int().min(1).optional().describe("Page number (optional, >0)"),
    buyer: z.string().min(3).optional().describe("Buyer institution keyword (optional, at least 3 characters)"),
    supplier: z.string().min(3).optional().describe("Supplier keyword (optional, at least 3 characters)"),
  },
  async ({ year, search, page, buyer, supplier }) => {
    const params = new URLSearchParams({
      year: String(year),
      search,
    });
    if (page) params.append("page", String(page));
    if (buyer) params.append("buyer", buyer);
    if (supplier) params.append("supplier", supplier);
    const data = await fetchSercop<any>(`/search_ocds?${params.toString()}`);
    if (!data) {
      return { content: [{ type: "text", text: "Failed to fetch contracting processes." }] };
    }
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

// Tool: Search contracting process by OCID
server.tool(
  "get-process-by-ocid",
  "Get a contracting process by its OCID identifier",
  {
    ocid: z.string().min(1).describe("The OCID identifier of the contracting process"),
  },
  async ({ ocid }) => {
    const params = new URLSearchParams({ ocid });
    const data = await fetchSercop<any>(`/record?${params.toString()}`);
    if (!data) {
      return { content: [{ type: "text", text: "Failed to fetch process by OCID." }] };
    }
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SERCOP MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error in main():", err);
  process.exit(1);
});
