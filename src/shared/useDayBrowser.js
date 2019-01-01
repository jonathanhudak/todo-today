import moment from 'moment';
import { useGlobalState } from 'shared';

export function useDayBrowser(defaultDay = moment()) {
  const { state, setState } = useGlobalState();
  const { currentDay } = state;
  const setDay = day => setState({ currentDay: day });
  const goToNextDay = () => setDay(currentDay.add(1, 'day'));
  const goToPreviousDay = () => setDay(currentDay.subtract(1, 'day'));
  const goToToday = () => setDay(moment());
  return {
    goToNextDay,
    goToPreviousDay,
    goToToday,
  };
}
