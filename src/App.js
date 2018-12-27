import React, { Suspense, useState } from 'react';
import localForage from 'localforage';
import './App.css';

function makeUniqueIdGenerator(id = '') {
  let i = 0;
  return function() {
    i += 1;
    return `${id}_${i}`;
  };
}

export const messages = {
  allDaysLabel: 'All days of the week',
  editLabel: 'Edit',
  saveLabel: 'Save',
};

export const everyDay = 'everyDay';
export const Monday = 'Monday';
export const Tuesday = 'Tuesday';
export const Wednesday = 'Wednesday';
export const Thursday = 'Thursday';
export const Friday = 'Friday';
export const Saturday = 'Saturday';
export const Sunday = 'Sunday';
export const dayNamesEnglish = [
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
];
const DAYS = Object.freeze(
  dayNamesEnglish.reduce((acc, d, index) => ({ ...acc, [d]: index }), {})
);
const getDay = day => DAYS[day];
const ALL_DAYS_SELECTED = dayNamesEnglish.map(getDay);

const createUniqueId = makeUniqueIdGenerator('todo');

export const createDefaultTodo = text => ({
  id: createUniqueId(),
  days: ALL_DAYS_SELECTED,
  text,
  isCompleted: false,
});
export const DEFAULT_TODOS = [];
export const DB_TODOS_KEY = 'todos';
export const STORE_KEY = 'ticboxStore';

const getTodos = async () => {
  try {
    let store = await localForage.getItem(DB_TODOS_KEY);
    if (!store) {
      await localForage.setItem(DB_TODOS_KEY, DEFAULT_TODOS);
      store = await localForage.getItem(DB_TODOS_KEY);
    }
    return store;
  } catch (e) {}
};

const saveTodos = todos => {
  return localForage.setItem(DB_TODOS_KEY, todos);
};

function DayPicker({ defaultSelectedDays, onSetSelectedDays }) {
  const [selectedDays, setSelectedDays] = useState(defaultSelectedDays);
  const isDaySelected = day => selectedDays.includes(getDay(day));
  const allDaysChecked = ALL_DAYS_SELECTED.every(day =>
    selectedDays.includes(day)
  );
  function syncDays(nextDays) {
    setSelectedDays(nextDays);
    onSetSelectedDays(nextDays);
  }
  function toggleCheckDay({ target }) {
    const day = DAYS[target.value];
    let nextDays;
    if (!isDaySelected(target.value)) {
      nextDays = [...selectedDays, day];
    } else {
      nextDays = selectedDays.filter(d => d !== day);
    }
    syncDays(nextDays);
  }
  return (
    <fieldset>
      <legend>Day</legend>
      <label>
        <input
          type="checkbox"
          value={everyDay}
          checked={allDaysChecked}
          onChange={() => syncDays(allDaysChecked ? [] : ALL_DAYS_SELECTED)}
        />
        {messages.allDaysLabel}
      </label>
      {!allDaysChecked && (
        <>
          &nbsp;—&nbsp;
          {dayNamesEnglish.map(day => (
            <label key={day}>
              <input
                type="checkbox"
                value={day}
                checked={isDaySelected(day)}
                onChange={toggleCheckDay}
              />
              {day}
            </label>
          ))}
        </>
      )}
    </fieldset>
  );
}

export const TODO_PLACEHOLDER = 'Climb Mt Rainier';

function TodoForm({ cancel, todo, save, defaultValue = '' }) {
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
          placeholder={TODO_PLACEHOLDER}
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

export const todoAriaLabelPart1 = 'Mark';
export const todoAriaLabelPart2 = 'as completed';
export const generateAriaLabelForTodo = ({ text }) =>
  `${todoAriaLabelPart1} ${text} ${todoAriaLabelPart2}`;
export const generateAriaLabelForEditTodoButton = ({ text }) => `Edit ${text}`;
function Todo({ todo, index, toggleTodo, removeTodo, updateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const setEditing = () => setIsEditing(true);
  const setNotEditing = () => setIsEditing(false);
  if (isEditing) {
    return (
      <div>
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
      </div>
    );
  }
  return (
    <div
      className="todo"
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
        <button onClick={() => removeTodo(index)}>x</button>
      </div>
    </div>
  );
}

export function TodoList({ defaultTodos = [] }) {
  const [todos, setTodos] = useState(defaultTodos);

  const syncTodos = newTodos => {
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const addTodo = todo => {
    const newTodos = [...todos, { id: createUniqueId(), ...todo }];
    syncTodos(newTodos);
  };

  const toggleTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    syncTodos(newTodos);
  };

  const removeTodo = index => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    syncTodos(newTodos);
  };

  const updateTodo = todo => {
    const newTodos = todos.map(t => (t.id === todo.id ? { ...t, ...todo } : t));
    syncTodos(newTodos);
  };

  return (
    <div className="app">
      <div className="todo-list">
        <ul>
          {Array.isArray(todos) &&
            todos.map((todo, index) => (
              <li key={index} style={{ padding: 10 }}>
                <Todo
                  index={index}
                  todo={todo}
                  toggleTodo={toggleTodo}
                  removeTodo={removeTodo}
                  updateTodo={updateTodo}
                />
              </li>
            ))}
          <li style={{ padding: 20 }}>
            <TodoForm save={addTodo} />
          </li>
        </ul>
      </div>
    </div>
  );
}

const Fallback = () => <div>Loading...</div>;

function generateTodoList() {
  let todos;
  return () => {
    if (!todos) {
      const promise = getTodos().then(td => {
        todos = td;
      });
      throw promise;
    }
    return <TodoList defaultTodos={todos} />;
  };
}

const TodoListWithDB = generateTodoList();

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <TodoListWithDB />
    </Suspense>
  );
}
