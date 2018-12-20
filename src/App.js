import React, { useState } from "react";
import merge from "lodash.merge";
import "./App.css";

function makeUniqueIdGenerator(id = "") {
  let i = 0;
  return function() {
    i += 1;
    return `${id}_${i}`;
  };
}

const createUniqueId = makeUniqueIdGenerator("todo");

const DEFAULT_TODOS = [
  {
    id: createUniqueId(),
    text: "doodle",
    isCompleted: false
  },
  {
    id: createUniqueId(),
    text: "60 push ups",
    isCompleted: false
  },
  {
    id: createUniqueId(),
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
    JSON.stringify(merge(currentStore, storeUpdate))
  );
};

function TodoForm({ save, defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    save(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

function Todo({ todo, index, toggleTodo, removeTodo, updateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  if (isEditing) {
    console.log(todo);
    return (
      <TodoForm
        save={text => {
          updateTodo({
            ...todo,
            text
          });
          setIsEditing(false);
        }}
        defaultValue={todo.text}
      />
    );
  }
  return (
    <div
      className="todo"
      onDoubleClick={() => setIsEditing(true)}
      style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
    >
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => toggleTodo(index)}
      />
      {todo.text}

      <div>
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

  const addTodo = text => {
    const newTodos = [...todos, { id: createUniqueId(), text }];
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
    const newTodos = todos.map(t => (t.id === todo.id ? todo : t));
    syncTodos(newTodos);
  };

  return (
    <div className="app">
      <div className="todo-list">
        {Array.isArray(todos) &&
          todos.map((todo, index) => (
            <Todo
              key={index}
              index={index}
              todo={todo}
              toggleTodo={toggleTodo}
              removeTodo={removeTodo}
              updateTodo={updateTodo}
            />
          ))}
        <TodoForm save={addTodo} />
      </div>
    </div>
  );
}

export default App;
