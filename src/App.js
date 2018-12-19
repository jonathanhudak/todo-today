import React, { useState } from "react";
import merge from "lodash.merge";
import "./App.css";

const DEFAULT_TODOS = [
  {
    text: "doodle",
    isCompleted: false
  },
  {
    text: "60 push ups",
    isCompleted: false
  },
  {
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

function Todo({ todo, index, toggleTodo, removeTodo }) {
  return (
    <div
      className="todo"
      style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}
    >
      {todo.text}

      <div>
        <button onClick={() => toggleTodo(index)}>Complete</button>
        <button onClick={() => removeTodo(index)}>x</button>
      </div>
    </div>
  );
}

function TodoForm({ addTodo }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
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
    const newTodos = [...todos, { text }];
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
            />
          ))}
        <TodoForm addTodo={addTodo} />
      </div>
    </div>
  );
}

export default App;
