import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("Incoming Update Body:", body);

    const toolCall =
      body.message?.toolCalls?.[0];

    const toolCallId =
      toolCall?.id ||
      body.toolCallId ||
      "default-call-id";

    // Extract old todo
    const oldTodo =
      body.oldTodo ||
      body.parameters?.oldTodo ||
      toolCall?.function?.arguments?.oldTodo ||
      toolCall?.arguments?.oldTodo;

    // Extract new todo
    const newTodo =
      body.newTodo ||
      body.parameters?.newTodo ||
      toolCall?.function?.arguments?.newTodo ||
      toolCall?.arguments?.newTodo;

    console.log("Old Todo:", oldTodo);
    console.log("New Todo:", newTodo);

    if (!oldTodo || !newTodo) {
      return Response.json({
        results: [
          {
            toolCallId,
            result:
              "Both oldTodo and newTodo are required"
          }
        ]
      });
    }

    const client = await clientPromise;
    const db = client.db("todoapp");

    // Fetch all todos
    const todos = await db
      .collection("todos")
      .find({})
      .toArray();

    const task = todos.find(
      (item) =>
        item.todo.toLowerCase() ===
        oldTodo.toLowerCase()
    );

    if (!task) {
      return Response.json({
        results: [
          {
            toolCallId,
            result: "Task not found"
          }
        ]
      });
    }

    // Update todo
    await db.collection("todos").updateOne(
      {
        _id: new ObjectId(task._id)
      },
      {
        $set: {
          todo: newTodo
        }
      }
    );

    return Response.json({
      results: [
        {
          toolCallId,
          result: `Task updated successfully from "${oldTodo}" to "${newTodo}"`
        }
      ]
    });

  } catch (error) {
    console.error("Update Error:", error);

    return Response.json({
      results: [
        {
          toolCallId: "error",
          result: "Failed to update task"
        }
      ]
    });
  }
}