import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

const operations = [
  {
    value: "uppercase",
    label: "Uppercase",
    description: "Convert all text to uppercase",
  },
  {
    value: "lowercase",
    label: "Lowercase",
    description: "Convert all text to lowercase",
  },
  {
    value: "reverse",
    label: "Reverse Text",
    description: "Reverse the input text",
  },
  {
    value: "wordcount",
    label: "Word Count",
    description: "Count the total number of words",
  },
];

const TaskForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    inputText: "",
    operation: "uppercase",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await onSubmit(formData);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      inputText: "",
      operation: "uppercase",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Task Title */}
      <div>
        <label className="block text-gray-300 mb-2 font-medium">
          Task Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Convert text to uppercase"
          required
          maxLength={100}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:border-orange-500"
        />
      </div>

      {/* Input Text */}
      <div>
        <label className="block text-gray-300 mb-2 font-medium">
          Input Text
        </label>

        <textarea
          name="inputText"
          value={formData.inputText}
          onChange={handleChange}
          placeholder="Enter the text you want to process..."
          required
          rows={6}
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:border-orange-500 resize-y"
        />

        <p className="text-gray-500 text-xs mt-2">
          Characters: {formData.inputText.length}
        </p>
      </div>

      {/* Operation */}
      <div>
        <label className="block text-gray-300 mb-3 font-medium">
          Select Operation
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {operations.map((operation) => (
            <label
              key={operation.value}
              className={`p-4 rounded-lg border cursor-pointer transition ${
                formData.operation === operation.value
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-gray-700 bg-gray-800 hover:border-gray-500"
              }`}
            >
              <input
                type="radio"
                name="operation"
                value={operation.value}
                checked={formData.operation === operation.value}
                onChange={handleChange}
                className="sr-only"
              />

              <p className="text-white font-medium">{operation.label}</p>

              <p className="text-gray-400 text-sm mt-1">
                {operation.description}
              </p>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-5 py-3 rounded-lg"
        >
          {loading ? "Creating..." : "Create Task"}
          {!loading && <ArrowRight size={18} />}
        </button>

        <button
          type="button"
          onClick={resetForm}
          disabled={loading}
          className="flex items-center gap-2 border border-gray-700 text-gray-300 hover:bg-gray-800 px-5 py-3 rounded-lg"
        >
          <RotateCcw size={17} />
          Reset
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
