import React from 'react';
import TodoForm from 'app/TodoForm';
import TodoListItem from 'app/TodoListItem';
import { useTodoList, useTodoHistory } from 'shared';
import DayBrowser from 'app/DayBrowser';
import { useDayBrowser } from 'shared';

export default function TodoList({
  defaultTodos = [],
  defaultHistory,
  defaultDay,
}) {
  const dayBrowserProps = useDayBrowser(defaultDay);
  const { day: currentSelectedDay } = dayBrowserProps;
  const {
    todos,
    filters,
    toggleFilter,
    isFilterActive,
    addTodo,
    removeTodo,
    updateTodo,
  } = useTodoList(defaultTodos, currentSelectedDay);
  const { history, toggleTodoForDay } = useTodoHistory(defaultHistory);

  return (
    <div>
      <DayBrowser {...dayBrowserProps} />
      <pre>{JSON.stringify(history, null, 2)}</pre>
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
                toggleTodo={toggleTodoForDay}
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
