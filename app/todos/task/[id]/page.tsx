"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
  userId: {
    name: string;
    email: string;
  };
}

export default function TodoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTodo() {
      const res = await fetch(`/api/todos/task?id=${id}`);
      const data = await res.json();
      if (data.success) setTodo(data.todo);
      setLoading(false);
    }
    loadTodo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading your mission 🚀
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white text-xl">
        <XCircle className="w-12 h-12 mb-2 text-red-400" />
        Mission not found 🌌
      </div>
    );
  }

  return (
    <>
      {/* Cosmic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1538370965047-78c8f3e0c14e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob" />
          <div className="absolute top-32 right-10 w-80 h-80 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-60 animation-delay-2000 animate-blob" />
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-60 animation-delay-4000 animate-blob" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.15); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 14s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      {/* Glass Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="relative w-full max-w-2xl">
          {/* Gradient Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-60" />

          <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-3xl border border-white/70 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
              <h1 className="text-3xl font-extrabold drop-shadow-lg flex items-center gap-2">
                Todo Mission
                {todo.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-yellow-400" />
                )}
              </h1>
            </div>

            {/* Content */}
            <div className="p-8">
              <p
                className={`text-xl sm:text-2xl font-bold mb-6 break-words ${
                  todo.completed ? "line-through text-gray-500" : "text-gray-800"
                }`}
              >
                {todo.text}
              </p>

              {/* Status */}
              <div className="flex items-center gap-3 mb-6">
                {todo.completed ? (
                  <CheckCircle className="w-7 h-7 text-green-600" />
                ) : (
                  <Clock className="w-7 h-7 text-yellow-600" />
                )}
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    todo.completed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {todo.completed ? "Completed" : "In Progress"}
                </span>
              </div>

              {/* Meta */}
              <div className="border-t pt-4 text-sm text-gray-500">
                Created by
                <span className="font-semibold text-gray-700 ml-1">
                  {todo.userId.name}
                </span>
                <div className="text-xs">{todo.userId.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
