import React, { useState } from 'react';
import TodoForm from 'app/TodoForm';

export const messages = {
  editLabel: 'Edit',
  deleteLabel: 'Remove',
};

export const generateAriaLabelForDeleteButton = ({ text }) =>
  `${messages.deleteLabel} ${text}`;

export const todoAriaLabelPart1 = 'Mark';
export const todoAriaLabelPart2 = 'as completed';
export const generateAriaLabelForTodo = ({ text }) =>
  `${todoAriaLabelPart1} ${text} ${todoAriaLabelPart2}`;
export const generateAriaLabelForEditTodoButton = ({ text }) => `Edit ${text}`;

export default function TodoListItem({
  isCompleted,
  todo,
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
        textDecoration: isCompleted ? 'line-through' : '',
      }}
    >
      <input
        aria-label={generateAriaLabelForTodo(todo)}
        type="checkbox"
        checked={isCompleted}
        onChange={toggleTodo}
      />
      {todo.text}

      <div>
        <button
          aria-label={generateAriaLabelForEditTodoButton(todo)}
          onClick={setEditing}
        >
          {messages.editLabel}
        </button>
        <button
          aria-label={generateAriaLabelForDeleteButton(todo)}
          onClick={() => removeTodo(todo)}
        >
          {messages.deleteLabel}
        </button>
      </div>
    </div>
  );
}
