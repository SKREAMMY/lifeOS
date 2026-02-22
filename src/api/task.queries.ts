import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, getTasks } from "./tasks.api";
import type { TasksQuery, Task } from "./tasks.api";

const keys = {
  tasks: (q: TasksQuery) => ["tasks", q] as const,
};

// console.log("keys are ",kesys);

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
      const prev = (qc.getQueryData(keys.tasks(q)) ?? []) as Array<any>;
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
      qc.invalidateQueries({ queryKey: keys.tasks(q) });
    },
  });
}
