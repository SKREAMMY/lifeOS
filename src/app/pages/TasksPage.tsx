import { useState, useMemo } from "react";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTasksQuery,
  useUpdateTaskMutation,
} from "../../api/task.queries";
import type { TasksQuery, TaskStatus } from "../../api/tasks.api";
import { useAppSelector } from "../hooks";

export default function TasksPage() {
  const filters = useAppSelector((s) => s.taskFilters);

  const q: TasksQuery = useMemo(() => filters, [filters]);
  console.log("q use memo /is ", q);

  const { data: taskData, isLoading, isError } = useTasksQuery(q);
  console.log("data from use query is ", taskData, isLoading, isError);

  const createMut = useCreateTaskMutation(q);
  const updateMut = useUpdateTaskMutation(q);
  const deleteMut = useDeleteTaskMutation(q);
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
      <div className="tasks">
        {taskData &&
          taskData.map((task) => {
            return (
              <div
                className="task"
                key={task?.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                {/* <div className="task_title">{task.title}</div> */}
                <div className="task_status">{task?.title}</div>
                <select
                  value={task?.status}
                  style={{ marginLeft: 16 }}
                  onChange={(e) =>
                    updateMut.mutate({
                      id: task?.id,
                      patch: { status: e.target.value as TaskStatus },
                    })
                  }
                >
                  <option value="todo">To Do</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
                <button
                  onClick={() => deleteMut.mutate(task?.id)}
                  disabled={deleteMut.isPending}
                  style={{ justifySelf: "start" }}
                >
                  Delete
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
