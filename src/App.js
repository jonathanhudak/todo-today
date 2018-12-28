import React, { Suspense } from 'react';
import { getTodos } from 'shared';
import { unstable_createResource as createResource } from 'react-cache';
import TodoList from 'app/TodoList';

const todosResource = createResource(getTodos);

const Fallback = () => <div>Loading...</div>;

const LiveTodoList = () => {
  const todos = todosResource.read();
  return <TodoList defaultTodos={todos} />;
};

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <LiveTodoList />
    </Suspense>
  );
}
