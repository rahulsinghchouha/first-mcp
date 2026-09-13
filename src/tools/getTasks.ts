import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllTasks } from "../services/taskService.js";

export function registerGetTasksTool(server: McpServer) {
    console.log("this is the mcp tool register");
  server.tool(
    "get_tasks",
    "Get all tasks from the task management database",
    {},
    async () => {
      try {
        const tasks = await getAllTasks();
        console.log("tasks data",tasks);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(tasks, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error("get_tasks failed:", error);

        return {
          content: [
            {
              type: "text",
              text: "Failed to retrieve tasks.",
            },
          ],
          isError: true,
        };
      }
    }
  );
}