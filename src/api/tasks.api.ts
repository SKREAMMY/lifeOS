const STORAGE_KEY = "lifeos_tasks";
const NETWORK_DELAY = 250;

export type TaskStatus = "todo" | "doing" | "done";

export type Task = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function nowIso() {
  return new Date().toISOString();
}

function sleep(delayMS: number) {
  return new Promise((r) => setTimeout(r, delayMS));
}

function loadTasks(): Task[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// creating some tasks if empty

function seedTaskIfEmpty() {
  const tasks = loadTasks();
  if (tasks.length > 0) return;

  const seed: Task[] = [
    {
      id: "t1",
      title: "Set up LifeOS skeleton",
      status: "done",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: "t2",
      title: "Build Tasks module (CRUD + filters)",
      status: "doing",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: "t3",
      title: "Add Habits module",
      status: "todo",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];

  saveTasks(seed);
}

export async function createTask(input: { title: string; status?: string }) {
  seedTaskIfEmpty();
  // mocking an API call here by adding a delay
  await sleep(NETWORK_DELAY);

  const tasks = loadTasks();
  const newTask = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    status: input.status ?? "todo",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  saveTasks([newTask, ...tasks]);
}
