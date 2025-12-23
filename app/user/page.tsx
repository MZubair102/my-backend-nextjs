"use client";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function UsersPage() {
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const result = await res.json();
      setUsers(result.data || []);
    } catch (error) {
      console.error(error);
      setStatus("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (values: { name: string; email: string }) => {
    setStatus("Saving...");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json();

      if (res.ok) {
        setStatus(`${result.message}`);
        fetchUsers();
      } else {
        setStatus(` ${result.message}`);
      }
    } catch (error) {
      console.error(error);
      setStatus("Error connecting to server");
    }
  };

  return (
<div
  className="min-h-screen bg-cover bg-center p-6 "
  style={{
    backgroundImage:
      "url('https://images.pexels.com/photos/3183170/pexels-photo-3183170.jpeg?auto=compress&cs=tinysrgb&w=1260')",
  }}
>
  <div className="backdrop-blur-sm bg-white/80 max-w-3xl mx-auto rounded-xl p-8 shadow-lg">
    <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
      User Management
    </h1>

    {/* Form */}
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Create New User</h2>
      <Formik
        initialValues={{ name: "", email: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div>
              <Field
                name="name"
                type="text"
                placeholder="Name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <Field
                name="email"
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              {isSubmitting ? "Saving..." : "Create User"}
            </button>
          </Form>
        )}
      </Formik>

      {status && (
        <p className="mt-4 text-center text-sm font-medium text-red-700">{status}</p>
      )}
    </div>

    {/* User List */}
    <div className="grid gap-4">
      {users.length === 0 && (
        <div className="text-center text-gray-700 py-4">No users found.</div>
      )}

      {users.map((user) => (
        <div
          key={user._id}
          className="bg-white/80 border border-gray-200 shadow-md rounded-xl p-4 flex justify-between items-center hover:shadow-xl transition"
        >
          <div>
            <h3 className="text-lg font-semibold text-indigo-700">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div className="text-xs text-gray-400">
            {new Date(user.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  );
}
