import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, FileText, RefreshCw } from "lucide-react";

import { getTaskById , runTask} from "../services/TaskService";
import StatusBadge from "../components/tasks/StatusBadge";

const TaskDetails = () => {
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const fetchTask = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getTaskById(id);

      const taskData = response.task || response.data?.task || response.data;

      if (!taskData || !taskData._id) {
        throw new Error("Task not found");
      }

      setTask(taskData);
      setError("")
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Unable to load task",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
    const interval = setInterval(() => {
      fetchTask();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchTask]);

  const handleRunTask = async () => {
    try {
      setRunning(true);
      setError("");

      await runTask(id);

      await fetchTask();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start task");
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading task details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-400">{error}</p>

        <Link to="/tasks" className="text-orange-400 hover:underline">
          Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4"
          >
            <ArrowLeft size={17} />
            Back to Tasks
          </Link>

          <h1 className="text-2xl font-bold text-white">Task Details</h1>

          <p className="text-gray-400 mt-1">
            View task information and processing output.
          </p>
        </div>

        <button
          onClick={fetchTask}
          className="flex items-center gap-2 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Main Information */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap justify-between gap-3">
          <h2 className="text-xl font-semibold text-white">{task.title}</h2>

          <StatusBadge status={task.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-gray-500 text-sm">Operation</p>
            <p className="text-white capitalize mt-1">{task.operation}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Created At</p>
            <p className="text-white mt-1">
              {task.createdAt ? new Date(task.createdAt).toLocaleString() : "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Started At</p>
            <p className="text-white mt-1">
              {task.startedAt ? new Date(task.startedAt).toLocaleString() : "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Completed At</p>
            <p className="text-white mt-1">
              {task.completedAt
                ? new Date(task.completedAt).toLocaleString()
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="text-orange-400" size={20} />

          <h2 className="text-white font-semibold">Input Text</h2>
        </div>

        <pre className="bg-gray-800 p-4 rounded-lg text-gray-300 whitespace-pre-wrap break-words text-sm">
          {task.inputText}
        </pre>
      </div>

      {/* Result */}
      {task.status === "success" && (
        <div className="bg-[#111827] border border-green-500/20 rounded-xl p-6">
          <h2 className="text-green-400 font-semibold mb-4">
            Processing Result
          </h2>

          <pre className="bg-gray-800 p-4 rounded-lg text-white whitespace-pre-wrap break-words text-sm">
            {String(task.result ?? "")}
          </pre>
        </div>
      )}

      {/* Error */}
      {task.status === "failed" && (
        <div className="bg-[#111827] border border-red-500/20 rounded-xl p-6">
          <h2 className="text-red-400 font-semibold mb-3">Processing Error</h2>

          <p className="text-gray-300 text-sm whitespace-pre-wrap">
            {task.errorMessage || "No error message available."}
          </p>
        </div>
      )}

      {/* Logs */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="text-orange-400" size={20} />

          <h2 className="text-white font-semibold">Task Logs</h2>
        </div>

        {task.logs?.length > 0 ? (
          <div className="space-y-4">
            {task.logs.map((log, index) => (
              <div
                key={log._id || index}
                className="border-l-2 border-orange-500 pl-4"
              >
                <p className="text-white text-sm">
                  {typeof log === "string"
                    ? log
                    : log.message || JSON.stringify(log)}
                </p>

                {log.timestamp && (
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No logs available yet.</p>
        )}
      </div>

      {/* Run Task button  */}
      {task?.status === "pending" && (
        <button
          onClick={handleRunTask}
          disabled={running}
          className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-black disabled:opacity-50"
        >
          {running ? "Starting..." : "Run Task"}
        </button>
      )}
    </div>
  );
};

export default TaskDetails;
