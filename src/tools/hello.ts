import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerHelloTool(server: McpServer) {
  server.tool(
    "hello",
    "Say hello to a person",
    {
      name: z.string(),
    },
    async ({ name }) => {
      return {
        content: [
          {
            type: "text",
            text: `Hello, ${name}!`,
          },
        ],
      };
    }
  );
}