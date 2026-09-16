import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

function createServer() {
    return new McpServer({
        name: "test-server",
        version: "1.0.0",
    });
}

function createTransport() {
    return new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
    } as any);
}

const server = createServer();

console.log("1. Server created");

const transport = createTransport();

console.log("2. Transport created");

await server.connect(transport as Transport);

console.log("3. CONNECT SUCCESS");