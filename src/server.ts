import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-first-mcp-server",
  version: "1.0.0",
});

server.tool(
    "hello",
    "say hello to a person",
    {
        name : z.string(),
    },
    async({name}) => {
        return {
            content : [
                {
                type: "text",
                text: `Hello, ${name}!`,
                }
            ]
        }
    }
)