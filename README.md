# SERCOP MCP Server

This project implements a Model Context Protocol (MCP) server in TypeScript for proxying the API at https://datosabiertos.compraspublicas.gob.ec/PLATAFORMA/datos-abiertos/api.

## Installation

```sh
npm install -g sercop-mcp
```

Or as a dependency:

```sh
npm install sercop-mcp
```

## CLI Usage

After installation, you can run the MCP server from the command line:

```sh
sercop-mcp
```

Or manually:

```sh
node build/index.js
```

## Setup

- Node.js 16+ and npm required.
- Run `npm install` to install dependencies.
- Build with `npx tsc` or `npm run build` (if script added).

## Usage

- The server exposes MCP tools that map to endpoints from the SERCOP open data API.
- To run the server: `node build/index.js` (after building).

## References
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/quickstart/server)
- [SERCOP Open Data API](https://datosabiertos.compraspublicas.gob.ec/PLATAFORMA/datos-abiertos/api)
- [MCP SDK](https://github.com/modelcontextprotocol/create-python-server)
