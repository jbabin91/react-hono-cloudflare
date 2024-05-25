import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type InferRequestType, type InferResponseType } from 'hono';
import { type Error } from 'postgres';

import { Head } from '@/components/seo';
import { Button } from '@/components/ui';
import { client } from '@/libs/api-client';
import { queryClient } from '@/libs/react-query';
import { useTodos } from '@/modules/todos';
import { formatDate } from '@/utils/format';

export const Route = createFileRoute('/_app/todos')({
  component: Todos,
});

function Todos() {
  const todos = useTodos();

  const $post = client.api.todos.$post;

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
    <>
      <Head description="Todos page" title="Todos" />
      <div>
        <Button
          onClick={() => {
            mutation.mutate({
              description: 'A longer description about writing code',
              id: Date.now().toString(),
              title: 'Write code',
            });
          }}
        >
          Add Todo
        </Button>
        {todos.isLoading ? <div>Loading...</div> : null}
        {todos.isError ? <div>Error: {todos.error.message}</div> : null}
        {todos.data ? (
          <ul>
            {todos.data?.map((todo) => (
              <li key={todo.id}>
                <h3>
                  {todo.title} - <span>{formatDate(todo.createdAt)}</span>
                </h3>
                <p>{todo.description}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
}
