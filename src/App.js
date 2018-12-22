import React, { useState } from "react";
import "./App.css";

function makeUniqueIdGenerator(id = "") {
  let i = 0;
  return function() {
    i += 1;
    return `${id}_${i}`;
  };
}

const everyDay = "everyDay";
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
const DEFAULT_SELECTED_DAYS = days.slice(0, 4);

const createUniqueId = makeUniqueIdGenerator("todo");

const DEFAULT_TODOS = [
  {
    id: createUniqueId(),
    days: DEFAULT_SELECTED_DAYS,
    text: "doodle",
    isCompleted: false
  },
  {
    id: createUniqueId(),
    days: DEFAULT_SELECTED_DAYS,
    text: "60 push ups",
    isCompleted: false
  },
  {
    id: createUniqueId(),
    days: DEFAULT_SELECTED_DAYS,
    text: "100 Russian Twists",
    isCompleted: false
  }
];

const DEFAULT_STATE = {
  todos: DEFAULT_TODOS,
  history: {}
};

const STORE_KEY = "ticboxStore";
const getStoreData = store => {
  try {
    if (typeof store === "string") {
      return JSON.parse(store);
    }
    return store;
  } catch (e) {}
};

const getStore = () => {
  const store = localStorage.getItem(STORE_KEY);
  if (!store) {
    localStorage.setItem(STORE_KEY, JSON.stringify(DEFAULT_STATE));
    return DEFAULT_STATE;
  }
  return getStoreData(store);
};

const setStore = storeUpdate => {
  const currentStore = getStoreData(getStore());
  localStorage.setItem(
    STORE_KEY,
    JSON.stringify({
      ...currentStore,
      ...storeUpdate
    })
  );
};

function DayPicker({ defaultSelectedDays, onSetSelectedDays }) {
  const [selectedDays, setSelectedDays] = useState(defaultSelectedDays);
  const isDaySelected = day => selectedDays.includes(day);
  const allDaysChecked = selectedDays === days;
  function toggleCheckDay({ target }) {
    const day = target.value;
    let nextDays;
    if (!isDaySelected(day)) {
      nextDays = [...selectedDays, day];
    } else {
      nextDays = selectedDays.filter(d => d !== day);
    }
    setSelectedDays(nextDays);
    onSetSelectedDays(nextDays);
  }
  return (
    <fieldset>
      <legend>Day</legend>
      <pre>{JSON.stringify(selectedDays, null, 2)}</pre>
      <label>
        <input
          type="checkbox"
          value={everyDay}
          checked={allDaysChecked}
          onChange={() => setSelectedDays(allDaysChecked ? [] : days)}
        />
        Pick all days
      </label>
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
    </fieldset>
  );
}

function TodoForm({ todo, save, defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);
  const [selectedDays, setSelectedDays] = useState(
    todo ? todo.days : DEFAULT_SELECTED_DAYS
  );

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    console.log(value);
    save({
      text: value,
      days: selectedDays
    });
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <label>
        New todo
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
              ...update
            });
            setNotEditing();
          }}
          defaultValue={todo.text}
        />
        <button onClick={setNotEditing}>Cancel</button>
      </div>
    );
  }
  return (
    <div
      className="todo"
      style={{
        textDecoration: todo.isCompleted ? "line-through" : ""
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

function App() {
  const [todos, setTodos] = useState(() => {
    const store = getStore();
    return store.todos || [];
  });
  const syncTodos = newTodos => {
    setTodos(newTodos);
    setStore({
      todos: newTodos
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
    console.log("update", todo);
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
        <TodoForm save={addTodo} />
      </div>
    </div>
  );
}

export default App;
