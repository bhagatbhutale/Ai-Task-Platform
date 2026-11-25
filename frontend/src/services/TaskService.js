import api from "./api";

export const getTasks = async (params = {}) => {
  const response = await api.get("/tasks", {
    params,
  });

  return response.data;
};

export const getTaskById = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);

  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);

  return response.data;
};

export const runTask = async (taskId) => {
  const response = await api.post(`/tasks/${taskId}/run`);

  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);

  return response.data;
};
