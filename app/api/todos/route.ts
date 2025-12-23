import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";
import User from "@/models/User";
import mongoose from "mongoose";

interface Params {
  params: { id: string };
}

export async function GET(req: Request) {
  await connectDB();

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const todos = await Todo.find({ userId: userId })
    .populate("userId", "name email") // 🔥 populate user info
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ success: true, todos });
}



export async function POST(req: Request) {
  await connectDB();

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { text} = await req.json();
  if (!text) {
    return NextResponse.json({ success: false, message: "Todo text required" }, { status: 400 });
  }

  const todo = await Todo.create({
    text,
    userId: new mongoose.Types.ObjectId(userId),
    // ⚡ ensure ObjectId
  });

  return NextResponse.json({ success: true, message: "Todo created", todo }, { status: 201 });
}



export async function PATCH(req: Request) {
  await connectDB();

  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  // Get todoId from query params
  const url = new URL(req.url);
  const todoId = url.searchParams.get("id");

  if (!todoId || !mongoose.Types.ObjectId.isValid(todoId)) {
    return NextResponse.json({ success: false, message: "Invalid todo id" }, { status: 400 });
  }

  // Get updated fields from request body
  const { text, completed } = await req.json();

  const updatedTodo = await Todo.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(todoId),
      userId: new mongoose.Types.ObjectId(userId),
    },
    {
      ...(text !== undefined && { text }),
      ...(completed !== undefined && { completed }),
    },
    { new: true } // return the updated document
  );

  if (!updatedTodo) {
    return NextResponse.json({ success: false, message: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Todo updated", todo: updatedTodo });
}
// export async function DELETE(req: Request) {
//   await connectDB();
//   const userId = req.headers.get("x-user-id");
//   const { id } = await req.json();

//   await Todo.deleteOne({ _id: id, userId });
//   return NextResponse.json({ success: true, message: "Todo deleted" });
// }

export async function DELETE(req: Request) {
  await connectDB();

  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const todoId = url.searchParams.get("id");

  if (!todoId || !mongoose.Types.ObjectId.isValid(todoId)) {
    return NextResponse.json({ success: false, message: "Invalid todo id" }, { status: 400 });
  }

  const deleted = await Todo.deleteOne({
    _id: new mongoose.Types.ObjectId(todoId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (deleted.deletedCount === 0) {
    return NextResponse.json({ success: false, message: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Todo deleted" });
}
