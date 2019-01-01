import React, { Suspense } from 'react';
import { getTodos, getTodoHistory } from 'shared';
import AppProviders from 'app/Providers';
import { unstable_createResource as createResource } from 'react-cache';
import TodoList from 'app/TodoList';

const todosResource = createResource(getTodos);
const todosHistoryResource = createResource(getTodoHistory);

const Fallback = () => <div>Loading...</div>;

const LiveTodoList = () => {
  const todos = todosResource.read();
  const history = todosHistoryResource.read();
  return <TodoList defaultTodos={todos} defaultHistory={history} />;
};

export default function App() {
  return (
    <AppProviders>
      <Suspense fallback={<Fallback />}>
        <LiveTodoList />
      </Suspense>
    </AppProviders>
  );
}
