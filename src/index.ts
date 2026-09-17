import express from "express";
import "dotenv/config";

import { createMcpServer } from "./server.js";
import { registerHelloTool } from "./tools/hello.js";
import { registerAddNumbersTool } from "./tools/addNumbers.js";
import { registerGetTasksTool } from "./tools/getTasks.js";
import { connectDatabase } from "./database/connection.js";
import { initializeDatabaseSchema } from "./database/schema.js";
import {registerCreateTaskTool} from "./tools/createTask.js";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    console.log("HTTP REQUEST:", req.method, req.url);
    next();
});
app.get("/", (req, res) => {
    console.log("Hi i am Rahul and I am back");
    return res.status(200).send("Hi i am back");
});

await connectDatabase();
await initializeDatabaseSchema();

app.post("/mcp", async (req, res) => {
    try {
        console.log("1. Creating server");

        const server = createMcpServer();

        console.log("2. Server created");

        registerHelloTool(server);
        registerAddNumbersTool(server);
        registerGetTasksTool(server);
        registerCreateTaskTool(server);
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true,
        } as any);

        console.log("3. Transport created");

        await server.connect(transport as Transport);

        console.log("4. Server connected");

        await transport.handleRequest(req, res, req.body);

        res.on("close", () => {
            void transport.close();
            void server.close();
        });

        console.log("5. Request handled");

    } catch (error) {
        console.error("MCP ERROR:", error);

        if (!res.headersSent) {
            res.status(500).json({
                error: "Internal MCP server error",
            });
        }
    }
});

app.listen(3000, () => {
    console.log("MCP server listening on port 3000");
});