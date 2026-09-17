import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createTask } from "../services/taskService.js";

export function registerCreateTaskTool(server: McpServer) {
  server.tool(
    "create_task",
    "Create a new task in the task management database",
    {
      title: z
        .string()
        .min(1)
        .describe("The title of the task"),

      description: z
        .string()
        .optional()
        .describe("Optional description of the task"),
    },
    async ({ title, description }) => {
      try {
        console.log("create_task called:", {
          title,
          hasDescription: description !== undefined,
        });

        const task = await createTask(title, description);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(task, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error("create_task failed:", error);

        return {
          content: [
            {
              type: "text",
              text: "Failed to create task.",
            },
          ],
          isError: true,
        };
      }
    }
  );
}