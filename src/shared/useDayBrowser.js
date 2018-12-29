import { useState } from 'react';
import moment from 'moment';

export function useDayBrowser(defaultDay = moment()) {
  const [day, setDay] = useState(defaultDay);
  const goToNextDay = () => setDay(day.add(1, 'day'));
  const goToPreviousDay = () => setDay(day.subtract(1, 'day'));
  const goToToday = () => setDay(moment());
  return {
    day,
    goToNextDay,
    goToPreviousDay,
    goToToday,
  };
}
