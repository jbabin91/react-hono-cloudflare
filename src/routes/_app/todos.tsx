import { createFileRoute } from '@tanstack/react-router';

import { Head } from '@/components/seo';
import { Button } from '@/components/ui';
import { useCreateTodo, useTodos } from '@/modules/todos';
import { formatDate } from '@/utils/format';

export const Route = createFileRoute('/_app/todos')({
  component: Todos,
});

function Todos() {
  const todos = useTodos();
  const createTodo = useCreateTodo();

  return (
    <>
      <Head description="Todos page" title="Todos" />
      <div>
        <Button
          onClick={() => {
            createTodo.mutate({
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
