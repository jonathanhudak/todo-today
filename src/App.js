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

const everyDay = 'everyDay';
const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const DAYS = Object.freeze(
  days.reduce((acc, d, index) => ({ ...acc, [d]: index }), {})
);
const getDay = day => DAYS[day];
const ALL_DAYS_SELECTED = days.map(getDay);

const createUniqueId = makeUniqueIdGenerator('todo');

const DEFAULT_TODOS = [
  {
    id: createUniqueId(),
    days: ALL_DAYS_SELECTED,
    text: 'doodle',
    isCompleted: false,
  },
  {
    id: createUniqueId(),
    days: ALL_DAYS_SELECTED,
    text: '60 push ups',
    isCompleted: false,
  },
  {
    id: createUniqueId(),
    days: ALL_DAYS_SELECTED,
    text: '100 Russian Twists',
    isCompleted: false,
  },
];

const DEFAULT_STATE = {
  todos: DEFAULT_TODOS,
  history: {},
};

const STORE_KEY = 'ticboxStore';
const getStoreData = store => {
  try {
    if (typeof store === 'string') {
      return JSON.parse(store);
    }
    return store;
  } catch (e) {}
};

const getStore = async () => {
  const store = await localForage.getItem(STORE_KEY);
  if (!store) {
    await localForage.setItem(STORE_KEY, JSON.stringify(DEFAULT_STATE));
    return DEFAULT_STATE;
  }
  return getStoreData(store);
};

function hydrateDatabase() {
  return getStore().then(store => {
    if (!store) {
      return localForage
        .setItem(STORE_KEY, JSON.stringify(DEFAULT_STATE))
        .then(s => {
          return getStoreData(s);
        });
    }
    return getStoreData(store);
  });
}

const setStore = storeUpdate => {
  const currentStore = getStoreData(getStore());
  localForage.setItem(
    STORE_KEY,
    JSON.stringify({
      ...currentStore,
      ...storeUpdate,
    })
  );
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
        All days of the week
      </label>
      {!allDaysChecked && (
        <>
          &nbsp;—&nbsp;
          {days.map(day => (
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
          type="text"
          className="input"
          placeholder="Climb Mt Rainier"
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
      <button type="submit">Save</button>
      <button onClick={cancel}>Cancel</button>
    </form>
  );
}

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
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => toggleTodo(index)}
      />
      {todo.text}

      <div>
        <button onClick={setEditing}>Edit</button>
        <button onClick={() => removeTodo(index)}>x</button>
      </div>
    </div>
  );
}

let database;

function TodoList() {
  if (!database) {
    const promise = hydrateDatabase().then(db => (database = db));
    throw promise;
  }
  const [todos, setTodos] = useState(database.todos);

  const syncTodos = newTodos => {
    setTodos(newTodos);
    setStore({
      todos: newTodos,
    });
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
        {Array.isArray(todos) &&
          todos.map((todo, index) => (
            <div key={index} style={{ padding: 20 }}>
              <Todo
                index={index}
                todo={todo}
                toggleTodo={toggleTodo}
                removeTodo={removeTodo}
                updateTodo={updateTodo}
              />
            </div>
          ))}
        <div style={{ padding: 20 }}>
          <TodoForm save={addTodo} />
        </div>
      </div>
    </div>
  );
}

const Fallback = () => <div>Loading...</div>;

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <TodoList />
    </Suspense>
  );
}
