import React from 'react';

export default function DayBrowser({
  day,
  goToNextDay,
  goToPreviousDay,
  goToToday,
}) {
  return (
    <div>
      <button onClick={goToPreviousDay}>Prev</button>
      <button onClick={goToToday}>Today</button>
      {day.format('dddd, MMMM Do YYYY')}
      <button onClick={goToNextDay}>Next</button>
    </div>
  );
}
