import { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import localForage from 'localforage';
import { DB_TODOS_HISTORY_KEY, formatDate } from 'shared';

export function useTodoHistory(defaultHistory = {}) {
  let lastHistory = defaultHistory;
  const [history, setHistory] = useState(defaultHistory);

  useEffect(() => {
    if (!isEqual(lastHistory, history)) {
      localForage.setItem(DB_TODOS_HISTORY_KEY, history);
    }
  });

  const getDayHistory = date => history[date] || [];
  const isCompletedForDay = (todoId, day) =>
    getDayHistory(formatDate(day)).includes(todoId);

  const toggleTodoForDay = (todoId, day) => {
    const date = formatDate(day);
    if (!date) return;
    const existingDayHistory = getDayHistory(date);
    const isCompletedForDay = existingDayHistory.includes(todoId);
    const nextTodoHistory = isCompletedForDay
      ? existingDayHistory.filter(t => t !== todoId)
      : [...existingDayHistory, todoId];
    const nextHistory = {
      ...history,
      [date]: nextTodoHistory,
    };
    lastHistory = nextHistory;
    setHistory(nextHistory);
  };

  return {
    history,
    isCompletedForDay,
    toggleTodoForDay,
    getDayHistory,
  };
}
