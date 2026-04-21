import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// CREATE
export async function POST(req) {
  const { todo } = await req.json();

  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection("todos").insertOne({
    todo,
    isCompleted: false,
    createdAt: new Date(),
  });

  return Response.json(result);
}

// GET
export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  const todos = await db.collection("todos").find({}).toArray();
  return Response.json(todos);
}

// UPDATE
export async function PUT(req) {
  const { id, todo, isCompleted } = await req.json();

  const client = await clientPromise;
  const db = client.db();

  await db.collection("todos").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        todo,
        isCompleted,
      },
    }
  );

  return Response.json({ success: true });
}

// DELETE
export async function DELETE(req) {
  const { id } = await req.json();

  const client = await clientPromise;
  const db = client.db();

  await db.collection("todos").deleteOne({
    _id: new ObjectId(id),
  });

  return Response.json({ success: true });
}