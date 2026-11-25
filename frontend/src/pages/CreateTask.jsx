import { useState } from "react";
import { CheckCircle2, AlertCircle, PlusCircle } from "lucide-react";

import TaskForm from "../components/tasks/TaskForm";
import { createTask } from "../services/TaskService";

const CreateTask = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleCreateTask = async (formData) => {
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await createTask(formData);

      setSuccess(response.message || "Task created successfully!");

      return response;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create task. Please try again.",
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="bg-orange-500/10 p-3 rounded-lg">
            <PlusCircle className="text-orange-400" size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">Create New Task</h1>

            <p className="text-gray-400 text-sm mt-1">
              Submit a task for background processing.
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg">
          <CheckCircle2 size={20} />
          {success}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 sm:p-8">
        <div className="mb-7">
          <h2 className="text-white font-semibold text-lg">Task Information</h2>

          <p className="text-gray-500 text-sm mt-1">
            Provide the text and select the operation.
          </p>
        </div>

        <TaskForm onSubmit={handleCreateTask} loading={loading} />
      </div>

      <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
        <h3 className="text-orange-400 font-medium">
          How does task processing work?
        </h3>

        <p className="text-gray-400 text-sm mt-2 leading-6">
          Your task is saved in MongoDB with pending status. You can then run it
          to add it to the Redis queue. A background worker processes the task
          and saves the result back to MongoDB.
        </p>
      </div>
    </div>
  );
};

export default CreateTask;
