import { Link } from "react-router-dom";
import { Eye, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

const TaskTable = ({ tasks, onDelete, deletingId }) => {
  if (!tasks.length) {
    return (
      <div className="p-10 text-center text-gray-400">No tasks found.</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
          <tr>
            <th className="p-4">Task Title</th>
            <th className="p-4">Operation</th>
            <th className="p-4">Status</th>
            <th className="p-4">Created</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr
              key={task._id}
              className="border-t border-gray-800 hover:bg-gray-800/30"
            >
              <td className="p-4 text-white font-medium">{task.title}</td>

              <td className="p-4 text-gray-400 capitalize">{task.operation}</td>

              <td className="p-4">
                <StatusBadge status={task.status} />
              </td>

              <td className="p-4 text-gray-400 text-sm">
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleDateString()
                  : "-"}
              </td>

              <td className="p-4">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/tasks/${task._id}`}
                    title="View details"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    <Eye size={18} />
                  </Link>

                  {task.status === "pending" && (
                    <button
                      onClick={() => onDelete(task._id)}
                      disabled={deletingId === task._id}
                      title="Delete task"
                      className="text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
