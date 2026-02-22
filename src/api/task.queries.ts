import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask, getTasks, updateTask } from "./tasks.api";
import type { TasksQuery, Task } from "./tasks.api";

const keys = {
  tasks: (q: TasksQuery) => ["tasks", q] as const,
};

export function useTasksQuery(q: TasksQuery) {
  console.log("q is use task query is ", q);
  return useQuery({
    queryKey: keys.tasks(q),
    queryFn: () => getTasks(q),
  });
}

export function useCreateTaskMutation(q: TasksQuery) {
  // console.log("query I got is ",q);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: { title: string; status?: string }) =>
      createTask(input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: keys.tasks(q) });
      const prev = (qc.getQueryData(keys.tasks(q)) ?? []) as Task[];
      console.log("prev is ", prev);
      const temp = {
        id: `temp-${Date.now()}`,
        title: input.title.trim(),
        status: input.status ?? "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // add the data
      qc.setQueryData(keys.tasks(q), [...prev, temp]);

      return { prev, tempId: temp.id };
    },
    onSuccess: (data, _input, ctx) => {
      console.log("created ", data, _input, ctx);
      const current = qc.getQueryData<Task[]>(keys.tasks(q)) ?? [];

      if (!ctx) return;

      qc.setQueryData(
        keys.tasks(q),
        current.map((t) => (t.id === ctx.tempId ? data : t))
      );
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTaskMutation(q: TasksQuery) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      id: string;
      patch: Partial<Pick<Task, "title" | "status">>;
    }) => updateTask(input.id, input.patch),

    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: keys.tasks(q) });

      const prev = qc.getQueryData<Task[]>(keys.tasks(q)) ?? [];
      console.log("prev in update query", prev);

      qc.setQueryData<Task[]>(
        keys.tasks(q),
        prev.map((d) =>
          d.id === id
            ? { ...d, ...patch, updatedAt: new Date().toISOString() }
            : d
        )
      );

      return { prev };
    },

    onError: (_err, _input, ctx) => {
      if (!ctx) return;

      qc.setQueryData(keys.tasks(q), ctx.prev);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTaskMutation(q: TasksQuery) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: keys.tasks(q) });

      const prev = qc.getQueryData<Task[]>(keys.tasks(q)) ?? [];
      qc.setQueryData(
        keys.tasks(q),
        prev.filter((t) => t.id !== id)
      );

      return { prev };
    },
    onError: (_err, _input, ctx) => {
      if (!ctx) return;

      qc.setQueryData(keys.tasks(q), ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
