const STORAGE_KEY = "lifeos_tasks";
const NETWORK_DELAY = 1000;

export type TaskStatus = "todo" | "doing" | "done";

export type TasksQuery = {
    status: TaskStatus | "all",
    search: string,
    sort: "newest" | "oldest"
}

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

function applyQuery(tasks: Task[], q: TasksQuery): Task[] {
  let result = [...tasks];

  if (q.status !== "all") {
    result = result.filter((t) => t.status === q.status);
  }

  if (q.search.trim()) {
    const s = q.search.trim().toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(s));
  }

  result.sort((a,b)=>{
    const av = new Date(a.createdAt).getTime();
    const bv = new Date(b.createdAt).getTime();
    return q.sort === "newest" ? bv-av : av-bv;
  });

  return result;
}

export async function getTasks(q: TasksQuery): Promise<Task[]> {
  seedTaskIfEmpty();
  await sleep(NETWORK_DELAY);

  const tasks = loadTasks();
  return applyQuery(tasks, q);
}

export async function createTask(input: { title: string; status?: string }) {

  console.log("creating new task");
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

export async function updateTask(
  id: string,
  patch: Partial<Pick<Task, "title" | "status">>,
): Promise<Task> {
  seedTaskIfEmpty();
  await sleep(NETWORK_DELAY);

  const tasks = loadTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("task not found");

  const updatedTask: Task = {
    ...tasks[idx],
    ...patch,
    title: patch.title ? patch.title.trim() : tasks[idx].title,
    updatedAt: nowIso(),
  };

  tasks[idx] = updatedTask;
  saveTasks(tasks);
  return updatedTask;
}

export async function deleteTask(id: string): Promise<{ id: string }> {
  seedTaskIfEmpty();
  await sleep(NETWORK_DELAY);

  const tasks = loadTasks();
  saveTasks(tasks.filter((t) => t.id !== id));
  return { id };
}
