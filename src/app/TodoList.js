import React from 'react';
import TodoForm from 'app/TodoForm';
import TodoListItem from 'app/TodoListItem';
import { useTodoList } from 'shared';

export default function TodoList({ defaultTodos = [] }) {
  const { todos, addTodo, toggleTodo, removeTodo, updateTodo } = useTodoList(
    defaultTodos
  );

  return (
    <div>
      <div>
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
