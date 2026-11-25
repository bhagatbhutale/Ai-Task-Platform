import { useCallback, useEffect, useState } from "react";
import { RefreshCw, ListTodo } from "lucide-react";

import { getTasks, deleteTask } from "../services/TaskService";
import TaskTable from "../components/tasks/TaskTable";

const LIMIT = 10;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit: LIMIT,
      };

      if (status) {
        params.status = status;
      }

      const response = await getTasks(params);

      const taskList =
        response.tasks || response.data?.tasks || response.data || [];

      if (!Array.isArray(taskList)) {
        throw new Error("Unexpected task API response");
      }

      setTasks(taskList);

      // Adapt these fields if your backend uses different names.
      const pages =
        response.pagination?.totalPages ??
        response.data?.pagination?.totalPages ??
        response.totalPages ??
        response.data?.totalPages;

      setTotalPages(
        Number.isFinite(Number(pages))
          ? Math.max(1, Number(pages))
          : taskList.length === LIMIT
            ? page + 1
            : page,
      );
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Unable to fetch tasks",
      );
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this pending task?",
    );

    if (!confirmed) return;

    setDeletingId(taskId);

    try {
      await deleteTask(taskId);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchTasks();

    const interval = setInterval(() => {
      fetchTasks();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchTasks]);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">All Tasks</h1>

          <p className="text-gray-400 mt-1">
            Manage and monitor your processing tasks.
          </p>
        </div>

        <button
          onClick={fetchTasks}
          disabled={loading}
          className="flex items-center gap-2 border border-gray-700 text-gray-300 hover:bg-gray-800 px-4 py-2.5 rounded-lg"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
        <label className="block text-gray-400 text-sm mb-2">
          Filter by status
        </label>

        <select
          value={status}
          onChange={handleStatusChange}
          className="w-full sm:w-64 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white outline-none focus:border-orange-500"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800 flex items-center gap-2">
          <ListTodo className="text-orange-400" size={20} />

          <h2 className="text-white font-semibold">Task List</h2>
        </div>

        {error && (
          <div className="p-4 text-red-400 text-sm">
            {error}
            <button onClick={fetchTasks} className="ml-2 underline">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading tasks...</div>
        ) : !error ? (
          <TaskTable
            tasks={tasks}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        ) : null}

        {/* Pagination */}
        <div className="p-5 border-t border-gray-800 flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 disabled:opacity-40"
            >
              Previous
            </button>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages || loading}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
