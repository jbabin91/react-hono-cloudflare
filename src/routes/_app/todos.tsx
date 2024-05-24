import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type InferRequestType, type InferResponseType } from 'hono';

import { Button } from '@/components/ui';
import { client } from '@/libs/api-client';
import { queryClient } from '@/libs/react-query';

export const Route = createFileRoute('/_app/todos')({
  component: Todos,
});

function Todos() {
  const query = useQuery({
    queryFn: async () => {
      const res = await client.api.todo.$get();
      return await res.json();
    },
    queryKey: ['todos'],
  });

  const $post = client.api.todo.$post;

  const mutation = useMutation<
    InferResponseType<typeof $post>,
    Error,
    InferRequestType<typeof $post>['form']
  >({
    mutationFn: async (todo) => {
      const res = await $post({
        form: todo,
      });
      return await res.json();
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <div>
      <Button
        onClick={() => {
          mutation.mutate({ id: Date.now().toString(), title: 'Write code' });
        }}
      >
        Add Todo
      </Button>
      <ul>
        {query.data?.todos.map((todo) => <li key={todo.id}>{todo.title}</li>)}
      </ul>
    </div>
  );
}
