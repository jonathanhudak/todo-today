import React, { useState } from 'react';
import TodoForm from 'app/TodoForm';

export const messages = {
  editLabel: 'Edit',
  deleteLabel: 'Remove',
};

export const todoAriaLabelPart1 = 'Mark';
export const todoAriaLabelPart2 = 'as completed';
export const generateAriaLabelForTodo = ({ text }) =>
  `${todoAriaLabelPart1} ${text} ${todoAriaLabelPart2}`;
export const generateAriaLabelForEditTodoButton = ({ text }) => `Edit ${text}`;

export default function TodoListItem({
  todo,
  index,
  toggleTodo,
  removeTodo,
  updateTodo,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const setEditing = () => setIsEditing(true);
  const setNotEditing = () => setIsEditing(false);
  if (isEditing) {
    return (
      <TodoForm
        todo={todo}
        save={update => {
          updateTodo({
            ...todo,
            ...update,
          });
          setNotEditing();
        }}
        defaultValue={todo.text}
        cancel={setNotEditing}
      />
    );
  }
  return (
    <div
      style={{
        textDecoration: todo.isCompleted ? 'line-through' : '',
      }}
    >
      <input
        aria-label={generateAriaLabelForTodo(todo)}
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => toggleTodo(index)}
      />
      {todo.text}

      <div>
        <button
          aria-label={generateAriaLabelForEditTodoButton(todo)}
          onClick={setEditing}
        >
          {messages.editLabel}
        </button>
        <button onClick={() => removeTodo(index)}>
          {messages.deleteLabel}
        </button>
      </div>
    </div>
  );
}
