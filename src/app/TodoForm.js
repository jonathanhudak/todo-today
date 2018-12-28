import React, { useState } from 'react';
import { ALL_DAYS_SELECTED } from 'shared';
import DayPicker from 'app/DayPicker';
export const TODO_PLACEHOLDER = 'Climb Mt Rainier';

export const messages = {
  editLabel: 'Edit',
  saveLabel: 'Save',
  todoTextPlaceholder: 'Climb Mt Rainier',
};

export default function TodoForm({ cancel, todo, save, defaultValue = '' }) {
  const [value, setValue] = useState(defaultValue);
  const [selectedDays, setSelectedDays] = useState(
    todo ? todo.days : ALL_DAYS_SELECTED
  );

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    save({
      text: value,
      days: selectedDays,
    });
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Todo&nbsp;
        <input
          autoFocus
          type="text"
          className="input"
          placeholder={messages.todoTextPlaceholder}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </label>
      {!!value && (
        <DayPicker
          defaultSelectedDays={selectedDays}
          onSetSelectedDays={setSelectedDays}
        />
      )}
      <button type="submit">{messages.saveLabel}</button>
      {!!defaultValue && <button onClick={cancel}>Cancel</button>}
    </form>
  );
}
