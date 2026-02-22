import { useState, useMemo } from "react";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTasksQuery,
  useUpdateTaskMutation,
} from "../../api/task.queries";
import type { TasksQuery, TaskStatus } from "../../api/tasks.api";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  setSort,
  setSearch,
  setStatus,
} from "../features/filters/taskFilterSlice";

const statuses: (TaskStatus | "all")[] = ["all", "todo", "doing", "done"];

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.taskFilters);

  const q: TasksQuery = useMemo(() => filters, [filters]);
  console.log("q use memo /is ", q);

  const { data: taskData, isLoading, isError, error } = useTasksQuery(q);
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
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label>
          Status{" "}
          <select
            value={filters.status}
            onChange={(e) =>
              dispatch(setStatus(e.target.value as TaskStatus | "all"))
            }
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort{" "}
          <select
            value={filters.sort}
            onChange={(e) =>
              dispatch(setSort(e.target.value as "newest" | "oldest"))
            }
          >
            <option value="newest">newest</option>
            <option value="oldest">oldest</option>
          </select>
        </label>

        <label style={{ flex: "1 1 240px" }}>
          Search{" "}
          <input
            value={filters.search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="search tasks..."
            style={{ width: "100%" }}
          />
        </label>
      </div>
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

      {isLoading && <div>Loading tasks...</div>}
      {isError && (
        <div style={{ color: "crimson" }}>
          Error: {error?.message || "An error occurred"}
        </div>
      )}
      <div className="tasks">
        {taskData &&
          taskData.map((task) => {
            return (
              <div
                className="task"
                key={task?.id}
                style={{
                  display: "grid",
                  justifyContent: "space-evenly",
                  marginTop: "20px",
                  gridTemplateColumns: "1fr 1fr 1fr",
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

      {(createMut.isError || updateMut.isError || deleteMut.isError) && (
        <div style={{ color: "crimson" }}>
          Mutation error:{" "}
          {(createMut.error as Error)?.message ||
            (updateMut.error as Error)?.message ||
            (deleteMut.error as Error)?.message}
        </div>
      )}
    </div>
  );
}
