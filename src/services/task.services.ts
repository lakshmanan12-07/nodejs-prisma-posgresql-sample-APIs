import { PrismaClient, Task, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new task
const createTask = async (data: Prisma.TaskCreateInput): Promise<Task> => {
  const newTask: Task = await prisma.task.create({ data });
  return newTask;
};

// Get task by ID
const getTaskById = async (id: string): Promise<Task | null> => {
  const task: Task | null = await prisma.task.findUnique({ where: { id } });
  return task;
};

// Get all tasks
const getAllTasks = async (
  filter: object,
  options?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortType?: string;
  }
): Promise<Task[]> => {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const sortBy = options?.sortBy ?? "createdAt";
  const sortType = options?.sortType ?? "desc";

  const tasks: Task[] = await prisma.task.findMany({
    where: filter,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sortBy]: sortType,
    },
  });
  return tasks;
};

// Update task by ID
const updateTask = async (
  id: string,
  data: Prisma.TaskUpdateInput
): Promise<Task> => {
  const updatedTask: Task = await prisma.task.update({
    where: { id },
    data,
  });
  return updatedTask;
};

// Delete task by ID
const deleteTask = async (id: string): Promise<Task> => {
  const deletedTask: Task = await prisma.task.update({
    where: { id },
    data: {
      deleted: true,
    },
  });
  return deletedTask;
};

// Get task by filter
const getTaskByFilter = async (filter: object): Promise<Task | null> => {
  const task: Task | null = await prisma.task.findFirst({
    where: { ...filter, deleted: false },
  });
  return task;
};

// Get task by filter
const getTasksCount = async (filter: object): Promise<number> => {
  const task: number = await prisma.task.count({
    where: { ...filter, deleted: false },
  });
  return task;
};

export default {
  deleteTask,
  updateTask,
  getAllTasks,
  getTaskById,
  createTask,
  getTaskByFilter,
  getTasksCount,
};
