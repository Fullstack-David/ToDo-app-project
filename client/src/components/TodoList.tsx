import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const { token } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/todos", newTodo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewTodo({ title: "", description: "" });
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTodos();
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mina uppgifter</h1>
      <form onSubmit={addTodo} className="mb-8">
        <input
          type="text"
          placeholder="Titel"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Beskrivning"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Lägg till uppgift
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="mb-4 p-4 border rounded">
            <h3 className="text-xl font-semibold">{todo.title}</h3>
            <p>{todo.description}</p>
            <div className="mt-2">
              <button
                onClick={() => toggleTodo(todo._id)}
                className={`mr-2 px-3 py-1 rounded ${
                  todo.completed ? "bg-green-500" : "bg-yellow-500"
                } text-white`}
              >
                {todo.completed ? "Klar" : "Markera som klar"}
              </button>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Ta bort
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
