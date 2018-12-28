import React, { useState } from 'react';
import {
  DAYS,
  ALL_DAYS_SELECTED,
  getDay,
  dayNamesEnglish,
  everyDay,
} from 'shared';

export const messages = {
  allDaysLabel: 'All days of the week',
};

export default function DayPicker({ defaultSelectedDays, onSetSelectedDays }) {
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
        {messages.allDaysLabel}
      </label>
      &nbsp;—&nbsp;
      {dayNamesEnglish.map(day => (
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
