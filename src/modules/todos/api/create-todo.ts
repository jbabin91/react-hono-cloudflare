import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type InferRequestType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/libs/api-client';
import { type MutationConfig } from '@/libs/react-query';
import { getTodosQueryOptions } from '@/modules/todos/api/get-todos';

const $post = client.api.todos.$post;

export async function createTodo(form: InferRequestType<typeof $post>['form']) {
  const res = await $post({
    form,
  });
  if (!res.ok) throw new Error('Failed to create a todo');
  return res.json();
}

type UseCreateTodoOptions = {
  mutationConfig?: MutationConfig<typeof createTodo>;
};

export function useCreateTodo({ mutationConfig }: UseCreateTodoOptions = {}) {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    mutationFn: createTodo,
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create todo');
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getTodosQueryOptions().queryKey,
      });
      toast.success('Todo created!');
      onSuccess?.(...args);
    },
    ...restConfig,
  });
}
