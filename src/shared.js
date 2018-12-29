import { useEffect, useState } from 'react';
import localForage from 'localforage';

// Store
export const DEFAULT_TODOS = [];
export const DB_TODOS_KEY = 'todos';

// Day Picker
export const everyDay = 'everyDay';
export const Monday = 'Monday';
export const Tuesday = 'Tuesday';
export const Wednesday = 'Wednesday';
export const Thursday = 'Thursday';
export const Friday = 'Friday';
export const Saturday = 'Saturday';
export const Sunday = 'Sunday';
export const dayNamesEnglish = [
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
];
export const DAYS = Object.freeze(
  dayNamesEnglish.reduce((acc, d, index) => ({ ...acc, [d]: index }), {})
);
export const getDay = day => DAYS[day];
export const ALL_DAYS_SELECTED = dayNamesEnglish.map(getDay);

// Utils
export function makeUniqueIdGenerator(id = '', initialIndex = 0) {
  let i = initialIndex;
  return function() {
    i += 1;
    return `${id}_${i}`;
  };
}

export const getTodos = async () => {
  try {
    let store = await localForage.getItem(DB_TODOS_KEY);
    if (!store) {
      await localForage.setItem(DB_TODOS_KEY, DEFAULT_TODOS);
      store = await localForage.getItem(DB_TODOS_KEY);
    }
    return store;
  } catch (e) {}
};

export function useFilters(filters = {}) {
  const allFilterNames = Object.keys(filters);
  const [currentFilters, setFilters] = useState(allFilterNames);

  const addFilter = name => setFilters([...currentFilters, name]);
  const removeFilter = name =>
    setFilters(currentFilters.filter(f => f !== name));
  const isFilterActive = name => currentFilters.includes(name);
  const toggleFilter = name =>
    isFilterActive(name) ? removeFilter(name) : addFilter(name);

  return {
    allFilterNames,
    currentFilters: currentFilters.map(n => filters[n]),
    addFilter,
    isFilterActive,
    removeFilter,
    toggleFilter,
  };
}

export const generateTodayFilter = today => ({ days }) => {
  return days.includes(today || new Date().getDay());
};

const Today = 'Today';

export const getTodoFilters = ({ today } = {}) => ({
  [Today]: generateTodayFilter(today),
});

export function useTodoList(
  defaultTodos = [],
  defaultFilters = getTodoFilters()
) {
  const generateId = makeUniqueIdGenerator('todo', defaultTodos.length - 1);
  const [todos, setTodos] = useState(defaultTodos);
  const { currentFilters, ...filterProps } = useFilters(defaultFilters);

  useEffect(
    () => {
      localForage.setItem(DB_TODOS_KEY, todos);
    },
    [todos]
  );

  const addTodo = todo => {
    const newTodos = [...todos, { id: generateId(), ...todo }];
    setTodos(newTodos);
  };

  const toggleTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    setTodos(newTodos);
  };

  const removeTodo = index => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const updateTodo = newTodo => {
    const newTodos = todos.map(todo => {
      if (newTodo.id !== todo.id) return todo;
      return { ...todo, ...newTodo };
    });
    setTodos(newTodos);
  };

  const filteredTodos = todos.filter(t => currentFilters.every(f => f(t)));

  return {
    todos: filteredTodos,
    filteredTodos,
    updateTodo,
    removeTodo,
    toggleTodo,
    addTodo,
    ...filterProps,
  };
}
