import {z} from "zod";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js"

export function registerAddNumbersTool(server:McpServer)
{
    server.tool(
        "add_numbers",
        "Add two numbers together",
        {
            a: z.number(),
            b: z.number()
        },
        async({a,b})=>{
            const result = a+b;

            return {
                content:[
                {
                    type:"text",
                    text: `The sum of ${a} and ${b} is ${result}`
                }
                ]
            }
        }
    )
}
