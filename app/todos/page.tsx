"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Menu, X, LogOut, CheckCircle, Edit2, Trash2 } from "lucide-react";

interface Todo {
  _id: string;
  text: string;
  completed?: boolean;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
}

interface User {
  name: string;
  email: string;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function loadTodos() {
    setLoading(true);
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data.todos || []);
    } catch (err) {
      console.error("Failed to load todos");
    } finally {
      setLoading(false);
    }
  }

  async function loadUser() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (err) {
      console.error("Failed to load user");
    }
  }

  useEffect(() => {
    loadUser();
    loadTodos();
  }, []);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text.trim() }),
    });

    setText("");
    loadTodos();
  }

  async function deleteTodo(id: string) {
    await fetch(`/api/todos?id=${id}`, { method: "DELETE" });
    loadTodos();
  }

  async function toggleTodo(todo: Todo) {
    const wasIncomplete = !todo.completed;
    await fetch(`/api/todos?id=${todo._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });

    loadTodos();

    if (wasIncomplete && todos.filter((t) => !t.completed).length === 1) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"],
      });
    }
  }

  async function saveEdit(todoId: string) {
    if (!editText.trim()) return;

    await fetch(`/api/todos?id=${todoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText.trim() }),
    });

    setEditingId(null);
    setEditText("");
    loadTodos();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const activeTodos = todos.filter((t) => !t.completed).length;

  const router = useRouter();

  return (
    <>
      {/* Epic Cosmic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* High-Quality Nebula Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1538370965047-78c8f3e0c14e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')",
          }}
        />

        {/* Dark overlay for depth and readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Animated Glowing Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob" />
          <div className="absolute top-32 right-10 w-80 h-80 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-60 animation-delay-2000 animate-blob" />
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-60 animation-delay-4000 animate-blob" />
        </div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 1.8}s`,
                animationDuration: `${18 + i * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Custom Keyframe Animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(40px, -60px) scale(1.15);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 14s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-50px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>

      {/* Gradient Navbar */}
      

      {/* Main Content */}
      <div className="relative z-10 py-4 px-2 sm:px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/96 backdrop-blur-2xl rounded-3xl shadow-3xl border border-white/70 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600/95 to-purple-600/95 px-6 sm:px-10 py-4 sm:py-8 text-white text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-1 sm:mb-3 drop-shadow-xl">
                My Todos
              </h1>
              <p className="text-indigo-100 text-lg sm:text-xl font-medium">
                {activeTodos === 0
                  ? "🎉 All done! You're unstoppable!"
                  : `${activeTodos} ${
                      activeTodos === 1 ? "task" : "tasks"
                    } left to conquer`}
              </p>
            </div>

            {/* Add Todo Form */}
            <div className="px-4 sm:px-10 pt-4 sm:pt-6 pb-4 sm:pb-8 ">
              <form
                onSubmit={addTodo}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What's next on your cosmic to-do list?"
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 outline-none text-gray-800 text-base sm:text-lg transition-all min-h-[20px] sm:min-h-[56px]"
                />
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg shadow-2xl transition-all transform hover:scale-105 min-h-[20px] sm:min-h-[56px]"
                >
                  Add Todo
                </button>
              </form>
            </div>

            

{/* Todos List */}
<div className="px-4 sm:px-10 pb-6 sm:pb-10">
  {loading ? (
    <div className="space-y-3 sm:space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-gray-100/70 rounded-2xl h-16 sm:h-20 animate-pulse"
        />
      ))}
    </div>
  ) : todos.length === 0 ? (
    <div className="text-center py-12 sm:py-20">
      <div className="text-7xl sm:text-9xl mb-6 sm:mb-8 opacity-50">
        ✨
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-2 sm:mb-4">
        Your universe is clear!
      </h3>
      <p className="text-base sm:text-xl text-gray-500">
        Add your first task to begin the journey 🚀
      </p>
    </div>
  ) : (
    <ul className="space-y-6 sm:space-y-8">
      {todos.map((todo) => (
        <li key={todo._id} className="relative group">
          {/* Gradient Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-60" />
          
          {/* Glass Card */}
          <div
            className={`relative bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 flex items-start sm:items-center gap-4 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 ${
              todo.completed ? "opacity-90" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={!!todo.completed}
              onChange={() => toggleTodo(todo)}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl accent-purple-600 focus:ring-4 focus:ring-purple-300 transition-all transform hover:scale-110 cursor-pointer"
            />

            <div className="flex-1 min-w-0">
              {editingId === todo._id ? (
                <div className="space-y-3">
                  <input
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-indigo-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 outline-none text-base sm:text-lg min-h-[40px] sm:min-h-[48px]"
                  />
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => saveEdit(todo._id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition min-h-[40px] sm:min-h-[48px]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditText("");
                      }}
                      className="bg-gray-300 hover:bg-gray-400 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition min-h-[40px] sm:min-h-[48px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p
                    onClick={() => router.push(`/todos/task/${todo._id}`)}
                    className={`cursor-pointer text-base sm:text-xl font-semibold break-words ${
                      todo.completed ? "line-through text-gray-500" : "text-gray-800"
                    }`}
                  >
                    {todo.text}
                  </p>
                  <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
                    Added by {todo.userId.name}
                  </p>
                </>
              )}
            </div>

            {!todo.completed && editingId !== todo._id && (
              <div className="flex gap-3 sm:gap-4 opacity-0 group-hover:opacity-100 transition-opacity mt-2 sm:mt-0">
                {/* Edit Icon */}
                <button
                  onClick={() => {
                    setEditingId(todo._id);
                    setEditText(todo.text);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 transition"
                >
                  <Edit2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Delete Icon */}
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  )}
</div>

          </div>

          {/* Completion Stats */}
          {!loading && todos.length > 0 && (
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-base sm:text-xl font-bold text-white drop-shadow-2xl">
                {todos.filter((t) => t.completed).length} of {todos.length}{" "}
                completed
                {todos.filter((t) => t.completed).length === todos.length &&
                  " 🌟"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
