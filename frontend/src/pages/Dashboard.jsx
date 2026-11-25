import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ListTodo,
  Clock,
  LoaderCircle,
  CheckCircle,
  XCircle,
  Plus,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import { getTasks } from "../services/TaskService";
import StatusBadge from "../components/tasks/StatusBadge";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setError("");

      const response = await getTasks({ page: 1, limit: 5 });

      // Supports common API response structures.
      const taskList =
        response.tasks || response.data?.tasks || response.data || [];

      if (!Array.isArray(taskList)) {
        throw new Error("Unexpected task API response");
      }

      setTasks(taskList);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Unable to load tasks",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: ListTodo,
      color: "text-orange-400",
    },
    {
      title: "Pending",
      value: tasks.filter((t) => t.status === "pending").length,
      icon: Clock,
      color: "text-yellow-400",
    },
    {
      title: "Running",
      value: tasks.filter((t) => t.status === "running").length,
      icon: LoaderCircle,
      color: "text-blue-400",
    },
    {
      title: "Successful",
      value: tasks.filter((t) => t.status === "success").length,
      icon: CheckCircle,
      color: "text-green-400",
    },
    {
      title: "Failed",
      value: tasks.filter((t) => t.status === "failed").length,
      icon: XCircle,
      color: "text-red-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="text-gray-400 mt-1">
            Monitor your task processing activity.
          </p>
        </div>

        <Link
          to="/create-task"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg"
        >
          <Plus size={18} />
          Create Task
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-[#111827] border border-gray-800 p-5 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">{stat.title}</p>

                <Icon className={stat.color} size={21} />
              </div>

              <h2 className="text-3xl font-bold text-white mt-4">
                {loading ? "..." : stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Recent Tasks */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl">
        <div className="p-5 flex items-center justify-between border-b border-gray-800">
          <div>
            <h2 className="text-white font-semibold text-lg">Recent Tasks</h2>
            <p className="text-gray-500 text-sm">
              Your latest processing tasks
            </p>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchTasks();
            }}
            className="text-gray-400 hover:text-white"
            title="Refresh tasks"
          >
            <RefreshCw size={19} />
          </button>
        </div>

        {error && (
          <div className="p-5 text-red-400 text-sm">
            {error}
            <button onClick={fetchTasks} className="ml-2 underline">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <p className="p-8 text-center text-gray-400">Loading tasks...</p>
        ) : !error && tasks.length === 0 ? (
          <div className="p-10 text-center">
            <ListTodo className="mx-auto text-gray-500 mb-3" size={35} />

            <p className="text-white font-medium">No tasks found</p>

            <p className="text-gray-500 text-sm mt-1">
              Create your first AI task to get started.
            </p>

            <Link
              to="/create-task"
              className="inline-block mt-4 text-orange-400 hover:underline"
            >
              Create your first task
            </Link>
          </div>
        ) : !error ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-gray-500 text-xs uppercase bg-gray-800/40">
                <tr>
                  <th className="p-4">Task</th>
                  <th className="p-4">Operation</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="border-t border-gray-800">
                    <td className="p-4 text-white font-medium">{task.title}</td>

                    <td className="p-4 text-gray-400">{task.operation}</td>

                    <td className="p-4">
                      <StatusBadge status={task.status} />
                    </td>

                    <td className="p-4 text-gray-400 text-sm">
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="p-4 border-t border-gray-800 flex justify-end">
          <Link
            to="/tasks"
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm"
          >
            View all tasks
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
