import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("Incoming Toggle Body:", body);

    const toolCall =
      body.message?.toolCalls?.[0];

    const toolCallId =
      toolCall?.id ||
      body.toolCallId ||
      "default-call-id";

    // Extract todo from Postman + Vapi payloads
    const todo =
      body.todo ||
      body.parameters?.todo ||
      toolCall?.function?.arguments?.todo ||
      toolCall?.arguments?.todo;

    console.log("Extracted Todo:", todo);

    if (!todo) {
      return Response.json({
        results: [
          {
            toolCallId,
            result: "Todo name is required"
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
        todo.toLowerCase()
    );

    if (!task) {
      return Response.json({
        results: [
          {
            toolCallId,
            result: "Todo not found"
          }
        ]
      });
    }

    // Toggle status
    const newStatus = !task.isCompleted;

    await db.collection("todos").updateOne(
      {
        _id: new ObjectId(task._id)
      },
      {
        $set: {
          isCompleted: newStatus
        }
      }
    );

    return Response.json({
      results: [
        {
          toolCallId,
          result: newStatus
            ? "Task marked as completed"
            : "Task marked as incomplete"
        }
      ]
    });

  } catch (error) {
    console.error("Toggle Error:", error);

    return Response.json({
      results: [
        {
          toolCallId: "error",
          result:
            "Failed to update task status"
        }
      ]
    });
  }
}