import React from 'react';
import TodoForm from 'app/TodoForm';
import TodoListItem from 'app/TodoListItem';
import { useTodoList } from 'shared';

export default function TodoList({ defaultTodos = [], defaultFilters }) {
  const {
    todos,
    allFilterNames,
    toggleFilter,
    isFilterActive,
    addTodo,
    toggleTodo,
    removeTodo,
    updateTodo,
  } = useTodoList(defaultTodos, defaultFilters);

  return (
    <div>
      <div>
        Filters
        {allFilterNames.map(name => (
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
                toggleTodo={toggleTodo}
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
