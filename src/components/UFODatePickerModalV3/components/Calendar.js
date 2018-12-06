import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import _ from 'lodash';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import PropTypes from 'prop-types';

import Month from './Month';
import styles from './../styles';
import { values } from './../../../utils/theme';

const moment = extendMoment(Moment);

export default class Calendar extends PureComponent {
  constructor() {
    super();
    this.state = { monthsData: [] };
  }

  componentDidMount() {
    this.generateListData();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.datesInfo !== this.props.datesInfo
      || !_.isEqual(prevProps.showDateRange, this.props.showDateRange)
      || !_.isEqual(prevProps.selectedDateRange, this.props.selectedDateRange)
    ) {
      this.generateListData();
    }
  }

  render() {
    return (
      <FlatList
        contentContainerStyle={styles.calendarList}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderMonth}
        data={this.state.monthsData}
      />
    );
  }

  keyExtractor = item => item.title;

  renderMonth = ({ item }) => <Month monthData={item} onDayPress={this.props.onDayPress} />;

  generateListData = () => {
    const { showDateRange } = this.props;

    if (!Array.isArray(showDateRange)) {
      return;
    }

    const monthsData = [];
    const firstRenderDate = moment(showDateRange[0]).startOf('month');
    const lastRenderDate = moment(showDateRange[1]).endOf('month');
    const renderRange = moment.range(firstRenderDate, lastRenderDate);

    for (const month of renderRange.by('month')) {
      const monthData = this.generateMonthData(month);
      monthsData.push(monthData);
    }

    this.setState({ monthsData });
  };

  generateMonthData = monthMoment => {
    const { showDateRange, selectedDateRange } = this.props;
    const monthData = {};
    const daysData = [];
    const monthRange = monthMoment.range('month');
    const dateInfoMap = this.getDatesInfoMap();

    monthData.title = monthMoment.format('MMMM YYYY');

    for (const day of monthRange.by('day')) {
      const dateStr = day.format(values.DATE_STRING_FORMAT);
      const dateInfo = dateInfoMap[dateStr];
      const isSelected = this.isDateSelected(day);
      const isDisabled = day.isBefore(showDateRange[0])
        || day.isAfter(showDateRange[1])
        || (dateInfo && dateInfo.available === false);

      daysData.push({
        date: dateStr,
        label: day.format('D'),
        disabled: isDisabled,
        available: dateInfo ? dateInfo.available : true,
        price: dateInfo ? dateInfo.message : null,
        isSelected: isSelected,
        isSelectedFirst: isSelected && day.isSame(selectedDateRange[0], 'day'),
        isSelectedLast: isSelected && selectedDateRange[1] && day.isSame(selectedDateRange[1], 'day')
      });
    }

    monthData.data = daysData;
    return monthData;
  };

  isDateSelected = dateMoment => {
    const { selectedDateRange } = this.props;

    if (!Array.isArray(selectedDateRange) || !selectedDateRange.length) {
      return false;
    }

    if (selectedDateRange.length < 2) {
      return dateMoment.isSame(selectedDateRange[0], 'day');
    }

    const selectedRange = moment.range(selectedDateRange);
    return selectedRange.contains(dateMoment);
  };

  getDatesInfoMap = () => {
    if (!this.props.datesInfo) {
      return {};
    }

    return this.props.datesInfo.reduce((obj, item) => {
        if (!item.calendarDay) {return obj;}
        obj[item.calendarDay] = item;
        return obj;
    }, {});
  };
}

Calendar.defaultProps = { showDateRange: [ moment(), moment().add(2, 'month') ] };

Calendar.propTypes = {
  showDateRange: PropTypes.array.isRequired,
  selectedDateRange: PropTypes.array,
  datesInfo: PropTypes.array,
  onDayPress: PropTypes.func
};
