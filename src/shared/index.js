import { useEffect, useState, useContext } from 'react';
import localForage from 'localforage';
import { Store } from 'app/Providers';
import moment from 'moment';

// Store
export const DEFAULT_TODOS = [];
export const DB_TODOS_KEY = 'todos';
export const DB_TODOS_HISTORY_KEY = 'history';

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

export const getTodoHistory = async () => {
  try {
    localForage.setItem(DB_TODOS_HISTORY_KEY, {});
    const store = await localForage.getItem(DB_TODOS_HISTORY_KEY);
    if (!store) {
      await localForage.setItem(DB_TODOS_HISTORY_KEY, {});
      return {};
    }
    return store;
  } catch (e) {}
};

export function formatDate(date) {
  const parsedDate = moment(date);
  const year = parsedDate.year();
  const month = parsedDate.month();
  const day = parsedDate.date();
  return `${month}-${day}-${year}`;
}

export function useGlobalState() {
  return useContext(Store);
}

export const getTodos = async () => {
  try {
    const store = await localForage.getItem(DB_TODOS_KEY);
    if (!store) {
      await localForage.setItem(DB_TODOS_KEY, DEFAULT_TODOS);
      return DEFAULT_TODOS;
    }
    return store;
  } catch (e) {}
};

export function useFilters(filters = {}) {
  const [currentFilters, setFilters] = useState(filters);

  const addFilter = name => setFilters([...currentFilters, name]);
  const removeFilter = name =>
    setFilters(currentFilters.filter(f => f !== name));
  const isFilterActive = name => currentFilters.includes(name);
  const toggleFilter = name =>
    isFilterActive(name) ? removeFilter(name) : addFilter(name);

  return {
    filters,
    currentFilters,
    isFilterActive,
    toggleFilter,
    setFilters: filters => setFilters(Object.keys(filters)),
  };
}

export const generateTodayFilter = today => ({ days }) => {
  return days.includes(today || new Date().getDay());
};

const Day = 'Day';

// export const filterMoreRecentTodos = ({ createdAt }) =>
export const requiredFilters = day => [];
export const getTodoFilters = ({ day } = {}) => ({
  [Day]: generateTodayFilter(day),
});

export function useTodoList(defaultTodos = [], day = moment()) {
  const generateId = makeUniqueIdGenerator('todo', defaultTodos.length - 1);
  const [todos, setTodos] = useState(defaultTodos);
  const filters = getTodoFilters({ day: day.get('day') });
  const { currentFilters, setFilters, ...filterProps } = useFilters(
    Object.keys(filters)
  );
  const activeFilters = [
    ...currentFilters.map(k => filters[k]),
    ...requiredFilters(day),
  ];

  const filteredTodos = todos.filter(t => activeFilters.every(f => f(t)));

  useEffect(
    () => {
      setFilters(getTodoFilters({ day: day.get('day') }));
    },
    [day]
  );

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

  const removeTodo = todoId => {
    setTodos(todos.filter(id => id !== todoId));
  };

  const updateTodo = newTodo => {
    const newTodos = todos.map(todo => {
      if (newTodo.id !== todo.id) return todo;
      return { ...todo, ...newTodo };
    });
    setTodos(newTodos);
  };

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

export { useDayBrowser } from './useDayBrowser';
export { useTodoHistory } from './useTodoHistory';
