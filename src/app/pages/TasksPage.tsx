import { useState, useMemo } from "react";
import { useCreateTaskMutation, useTasksQuery } from "../../api/task.queries";
import type { TasksQuery } from "../../api/tasks.api";
import { useAppSelector } from "../hooks";

export default function TasksPage() {
  const filters = useAppSelector((s) => s.taskFilters);

  const q: TasksQuery = useMemo(() => filters, [filters]);
  console.log("q use memo /is ", q);

  const { data, isLoading, isError } = useTasksQuery(q);
  console.log("data from use query is ", data);

  const createMut = useCreateTaskMutation(q);
  // console.log("create mut is ", createMut);

  const [title, setTitle] = useState("");

  function addTask() {
    const t = title.trim();
    if (!t) return;

    createMut.mutate({ title: t, status: "todo" });
  }
  return (
    <div>
      <h1>Tasks</h1>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          style={{ flex: 1 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />
        <button onClick={addTask} disabled={createMut.isPending}>
          {createMut.isPending ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
