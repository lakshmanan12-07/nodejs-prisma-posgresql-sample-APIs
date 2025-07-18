import { Request, Response } from "express";
import taskServices from "../services/task.services";
import { CustomRequest } from "../config/auth";

const createTask = async function (req: Request, res: Response) {
  try {
    const checkUser = await taskServices.getTaskByFilter({
      deleted: false,
      name: {
        equals: req.body.name,
        mode: "insensitive",
      },
      userId: req.body.userId,
    });
    if (checkUser)
      return res.status(400).send({
        code: 400,
        message: "Task Name already found",
      });

    const task = await taskServices.createTask(req.body);

    return res.status(200).send({
      code: 200,
      data: task,
    });
  } catch (error: any) {
    return res.status(500).send({
      code: 500,
      data: null,
      message: error.message,
    });
  }
};

const updateTask = async function (req: Request, res: Response) {
  try {
    const checkTask = await taskServices.getTaskById(req.params.taskId);
    if (!checkTask)
      return res.status(400).send({
        code: 400,
        message: "Task not found",
      });

    const userId = (req as CustomRequest).userId;
    if (userId != checkTask.userId)
      return res.status(400).send({
        code: 400,
        message: "You cannot update others Task",
      });

    const task = await taskServices.updateTask(checkTask.id, req.body);

    return res.status(200).send({
      code: 200,
      data: task,
    });
  } catch (error: any) {
    return res.status(500).send({
      code: 500,
      data: null,
      message: error.message,
    });
  }
};

const getTaskById = async function (req: Request, res: Response) {
  try {
    const checkTask = await taskServices.getTaskById(req.params.taskId);
    const userId = (req as CustomRequest).userId;
    if (checkTask && userId != checkTask.userId)
      return res.status(400).send({
        code: 400,
        message: "This is task is not available for You",
      });

    return res.status(200).send({
      code: 200,
      data: checkTask,
    });
  } catch (error: any) {
    return res.status(500).send({
      code: 500,
      data: null,
      message: error.message,
    });
  }
};

const deleteTask = async function (req: Request, res: Response) {
  try {
    const checkTask = await taskServices.getTaskById(req.params.taskId);
    if (!checkTask)
      return res.status(400).send({
        code: 400,
        message: "Task not found",
      });
    const userId = (req as CustomRequest).userId;
    if (userId != checkTask.userId)
      return res.status(400).send({
        code: 400,
        message: "You dont have access to delete this task",
      });

    const task = await taskServices.deleteTask(checkTask.id);

    return res.status(200).send({
      code: 200,
      data: task,
    });
  } catch (error: any) {
    return res.status(500).send({
      code: 500,
      data: null,
      message: error.message,
    });
  }
};

const fetchTask = async function (req: Request, res: Response) {
  try {
    const tasks = await taskServices.getAllTasks(
      {
        ...(req.body.filter ? req.body.filter : {}),
        deleted: false,
        userId: req.body.userId,
      },
      {
        limit: req.body.limit,
        page: req.body.page,
        sortBy: req.body.sortBy,
        sortType: req.body.sortType,
      }
    );

    const totalTaskCount = await taskServices.getTasksCount({
      ...(req.body.filter ? req.body.filter : {}),
      deleted: false,
      userId: req.body.userId,
    });

    return res.status(200).send({
      code: 200,
      data: tasks,
      count: totalTaskCount,
    });
  } catch (error: any) {
    return res.status(500).send({
      code: 500,
      data: null,
      message: error.message,
    });
  }
};

export default {
  createTask,
  updateTask,
  getTaskById,
  deleteTask,
  fetchTask,
};
