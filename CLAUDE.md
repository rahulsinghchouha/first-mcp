# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project overview

A Model Context Protocol (MCP) server in TypeScript. It exposes tools to MCP clients over Streamable HTTP, including tools that read and write a task list stored in PostgreSQL.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the server with `nodemon` + `tsx` (auto-reloads), listening on port 3000
- `npx tsc --noEmit` — type-check (there is no build script; `dist` is gitignored but unused so far)
- `npm test` — placeholder only, there are no tests yet

## Environment

- Requires a running PostgreSQL instance.
- `.env` must define `DATABASE_URL` (Postgres connection string). It is loaded via `dotenv/config`.
- The server connects to the database and creates the schema at startup, and exits if either fails.

## Architecture

Layered structure under `src/`:

- `index.ts` — entry point. Sets up Express, connects to the DB, initializes the schema, and serves `POST /mcp`. Also has a `GET /` route that returns a plain-text response.
- `server.ts` — `createMcpServer()` factory returning a new `McpServer` (`my-first-mcp-server`).
- `tools/` — one file per MCP tool, each exporting a `registerXTool(server)` function: `hello`, `add_numbers`, `get_tasks`, `create_task`.
- `services/taskService.ts` — business-logic layer between tools and SQL.
- `database/connection.ts` — shared `pg` `Pool` and `connectDatabase()`.
- `database/schema.ts` — `initializeDatabaseSchema()` runs `CREATE TABLE/INDEX IF NOT EXISTS` in a transaction. There is no migration tool, so schema changes must be made here idempotently.
- `database/queries/taskQueries.ts` — parameterized SQL and the `Task` interface.

Call flow for task tools: `tools/*` → `services/taskService` → `database/queries/taskQueries` → `pool`.

### Request handling

The MCP endpoint is **stateless**: every `POST /mcp` request creates a new `McpServer`, registers all tools, and creates a new `StreamableHTTPServerTransport` (`sessionIdGenerator: undefined`, `enableJsonResponse: true`). Both are closed when the response closes. Do not store per-session state on the server object.

### Adding a tool

1. Create `src/tools/<name>.ts` exporting `register<Name>Tool(server: McpServer)`, using `server.tool(name, description, zodShape, handler)`.
2. Tools that touch the DB go through `taskService`, not straight to `pool`. Add the service and query functions if they don't exist.
3. Import and call the register function in the `POST /mcp` handler in `src/index.ts`. It must be registered per request, alongside the others.
4. On failure, log the error and return `{ content: [{ type: "text", text: "..." }], isError: true }` rather than throwing (see `get_tasks.ts` / `create_task.ts`).

`taskService` already has `getTaskById`, `updateTask` and `deleteTask`, but no MCP tools use them yet.

## Conventions

- ESM project (`"type": "module"`, `module: nodenext`): **relative imports must use the `.js` extension** even though the source files are `.ts`.
- `verbatimModuleSyntax` is on: use `import type { ... }` for type-only imports.
- `strict` TypeScript is enabled.
- Zod v4 is used for tool input schemas.
- Use parameterized queries (`$1`, `$2`, …) for all SQL. Never interpolate user input.
- Tool responses return text content; structured data is returned as `JSON.stringify(data, null, 2)`.

## Known issues / cleanup candidates

- `.gitignore` only ignores `node_modules`, and `.env` is currently tracked by git. Add `.env` (and `dist`) to `.gitignore` and untrack `.env` with `git rm --cached .env`. If the database password is a real credential, rotate it.
- `src/server.ts` contains a large commented-out block from an earlier version.
- `src/index.ts` has verbose step-by-step `console.log` debugging in the `/mcp` handler.
- There are no tests and no lint or format configuration.
