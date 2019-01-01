import React from 'react';
import TodoForm from 'app/TodoForm';
import TodoListItem from 'app/TodoListItem';
import { useTodoList, useTodoHistory } from 'shared';
import DayBrowser from 'app/DayBrowser';
import { useGlobalState } from 'shared';

export default function TodoList({
  defaultTodos = [],
  defaultHistory,
  defaultDay,
}) {
  const { state } = useGlobalState();
  const { currentDay } = state;
  const {
    todos,
    filters,
    toggleFilter,
    isFilterActive,
    addTodo,
    removeTodo,
    updateTodo,
  } = useTodoList(defaultTodos, currentDay);
  const { history, toggleTodoForDay, isCompletedForDay } = useTodoHistory(
    defaultHistory
  );
  const isTodoCompleted = ({ id }) => isCompletedForDay(id, currentDay);

  return (
    <div>
      <DayBrowser />
      <pre>{JSON.stringify(history, null, 2)}</pre>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <div>
        Filters
        {filters.map(name => (
          <label key={name}>
            {name}
            <input
              type="checkbox"
              checked={isFilterActive(name)}
              onChange={() => toggleFilter(name)}
            />
          </label>
        ))}
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>
              <TodoListItem
                index={index}
                todo={todo}
                isCompleted={isTodoCompleted(todo)}
                toggleTodo={() => toggleTodoForDay(todo.id, currentDay)}
                removeTodo={removeTodo}
                updateTodo={updateTodo}
              />
            </li>
          ))}
          <li>
            <TodoForm save={addTodo} />
          </li>
        </ul>
      </div>
    </div>
  );
}
