import moment from 'moment';

import { values } from './../../utils/theme';

export function getPreselectedDatesForRollPicker() {
  const dates = [];
  const currentDate = moment();
  const maxDate = moment().add(1, 'y').startOf('day');

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
