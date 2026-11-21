import Task from "../../../shared/models/task.model.js"

const processText = (text, operation) => {
  switch (operation) {
    case "uppercase":
      return text.toUpperCase();

    case "lowercase":
      return text.toLowerCase();

    case "reverse":
      return Array.from(text).reverse().join("");

    case "wordcount":
      return text.trim() ? text.trim().split(/\s+/).length : 0;

    default:
      throw new Error("Unsupported operation");
  }
};

export default processText;




