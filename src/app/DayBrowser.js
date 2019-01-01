import React from 'react';
import { useGlobalState, useDayBrowser } from 'shared';

export default function DayBrowser() {
  const { state } = useGlobalState();
  const { currentDay } = state;
  const { goToNextDay, goToPreviousDay, goToToday } = useDayBrowser();
  return (
    <div>
      <button onClick={goToPreviousDay}>Prev</button>
      <button onClick={goToToday}>Today</button>
      {currentDay.format('dddd, MMMM Do YYYY')}
      <button onClick={goToNextDay}>Next</button>
    </div>
  );
}
