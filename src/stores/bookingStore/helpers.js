import moment from 'moment';

import { values } from './../../utils/theme';

export function getPreselectedDatesForRollPicker(periodInMonths = 12) {
  const dates = [];
  const currentDate = moment();
  const maxDate = moment().add(periodInMonths, 'month').startOf('day');

  while (currentDate.isBefore(maxDate)) {
    const dateString = currentDate.format(values.DATE_ROLLPICKER_FORMAT);
    dates.push({
      label: dateString,
      id: dateString,
      available: true
    });
    currentDate.add(1, 'days');
  }

  return dates;
}

export function getTimeItemsForRollPicker() {
  const timeItems = [];
  const timeOfDay = moment().startOf('day');
  const nextDay = moment(timeOfDay).add(1, 'day');

  while (timeOfDay.isBefore(nextDay)) {
    const timeString = timeOfDay.format(values.TIME_STRING_FORMAT);
    timeItems.push({
      label: timeString,
      id: timeString
    });
    timeOfDay.add(30, 'minutes');
  }

  return timeItems;
}
