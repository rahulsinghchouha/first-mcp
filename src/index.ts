import express from "express";
import "dotenv/config";

import { server } from "./server.js";

import { registerHelloTool } from "./tools/hello.js";
import { registerAddNumbersTool } from "./tools/addNumbers.js";
import { connectDatabase } from "./database/connection.js";
import { registerGetTasksTool } from "./tools/getTasks.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const app = express();
const transport = new StreamableHTTPServerTransport({});
app.get("/",(req,res)=>{
    console.log("Hi i am Rahul and I am back");
    return res.status(200).send("Hi i am back");
});

await connectDatabase();
registerHelloTool(server);
registerAddNumbersTool(server);
registerGetTasksTool(server);



app.post("/mcp", async (req, res) => {
  await server.connect(transport);

  await transport.handleRequest(req, res, req.body);
});
app.listen(3000,()=>{
    console.log("hi i am listening to 3000");
})
