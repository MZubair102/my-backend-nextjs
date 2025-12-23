"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Circle, XCircle } from "lucide-react";

interface Todo {
  _id: string;
  text: string;
  completed?: boolean;
}

interface Stats {
  total: number;
  completed: number;
  pending: number;
  completedPercent: number;
}

export default function StatsPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    pending: 0,
    completedPercent: 0,
  });

  async function loadTodos() {
    setLoading(true);
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();

      if (data.success) {
        setTodos(data.todos);
        calculateStats(data.todos);
      }
    } catch (err) {
      console.error("Failed to load todos");
    } finally {
      setLoading(false);
    }
  }

  function calculateStats(todos: Todo[]) {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    const completedPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

    setStats({ total, completed, pending, completedPercent });
  }

  useEffect(() => {
    loadTodos();
  }, []);

  // Reusable card with gradient border
  const StatCard = ({ icon, title, value, colorClass }: any) => (
    <div className="relative rounded-2xl">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-60" />
      <div className={`relative bg-white/95 backdrop-blur-2xl rounded-2xl p-6 shadow-lg flex items-center gap-4`}>
        <div className={`h-10 w-10 ${colorClass}`}>{icon}</div>
        <div>
          <p className="text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );

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

      {/* Glass Card Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-4xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-60" />
          <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-3xl border border-white/70 overflow-hidden">
            {/* Header (like Todo Detail) */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white flex items-center gap-2 drop-shadow-lg">
              <h1 className="text-3xl font-extrabold drop-shadow-lg flex items-center gap-2">
                Todo Statistics
                <CheckCircle className="w-7 h-7 text-green-400" />
              </h1>
            </div>

            {/* Stats Content */}
            <div className="p-8">
              {loading ? (
                <div className="text-center text-gray-500">Loading stats...</div>
              ) : stats.total === 0 ? (
                <div className="text-center text-gray-500 text-xl">
                  No todos yet. Add some tasks to see statistics!
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  <StatCard
                    icon={<Circle className="h-10 w-10 text-indigo-600" />}
                    title="Total Todos"
                    value={stats.total}
                    colorClass="text-indigo-600"
                  />
                  <StatCard
                    icon={<CheckCircle className="h-10 w-10 text-green-600" />}
                    title="Completed"
                    value={`${stats.completed} (${stats.completedPercent}%)`}
                    colorClass="text-green-600"
                  />
                  <StatCard
                    icon={<XCircle className="h-10 w-10 text-yellow-600" />}
                    title="Pending"
                    value={stats.pending}
                    colorClass="text-yellow-600"
                  />
                  <StatCard
                    icon={<CheckCircle className="h-10 w-10 text-purple-600" />}
                    title="Completion Rate"
                    value={`${stats.completedPercent}%`}
                    colorClass="text-purple-600"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}