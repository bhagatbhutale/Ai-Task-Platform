import Task from "../models/task.model.js";

// CREATE TASK
export const createTask = async (req, res, next) => {
  try {
    const { title, inputText, operation } = req.body;

    const task = await Task.create({
      userId: req.user.userId,
      title,
      inputText,
      operation,
      status: "pending",
      logs: [
        {
          message: "Task created successfully.",
          level: "info",
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL USER TASKS
export const getTasks = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10),
    );

    const filter = {
      userId: req.user.userId,
    };

    if (req.query.status) {
      const allowedStatuses = ["pending", "running", "success", "failed"];

      if (!allowedStatuses.includes(req.query.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status filter.",
        });
      }

      filter.status = req.query.status;
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-logs"),

      Task.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE TASK
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE TASK
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
      status: "pending",
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Pending task not found or cannot be deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};


// UPDATE PENDING TASK
export const updateTask = async (req, res, next) => {
  try {
    const { title, inputText, operation } = req.body;

    const updates = {};

    if (title !== undefined) updates.title = title;
    if (inputText !== undefined) updates.inputText = inputText;
    if (operation !== undefined) updates.operation = operation;

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
        status: "pending",
      },
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Pending task not found or cannot be updated.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      task,
    });

  } catch (error) {
    next(error);
  }
};