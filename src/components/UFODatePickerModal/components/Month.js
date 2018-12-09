import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';

import Day from './Day';
import styles from './../styles';

export default class Month extends PureComponent {
  render() {
    const { monthData, onDayPress } = this.props;

    return (
      <View>
        <Text style={styles.monthTitle}>
          {monthData.title}
        </Text>
        {this.renderWeekLabels()}
        <View style={styles.monthContainer}>
          {this.renderStartGaps()}
          {monthData.data.map(day => (
            <Day
              key={day.date}
              dayData={day}
              onDayPress={onDayPress}
            />
          ))}
        </View>
      </View>
    );
  }

  renderStartGaps = () => {
    if (!this.props.monthData.data.length) {
      return null;
    }

    const firstDay = this.props.monthData.data[0].date;
    const gapsCount = moment(firstDay).day();

    return new Array(gapsCount).fill(null).map((item, i) => (
      <View
        key={`gap-${i}`}
        style={styles.dayGap}
      />
    ));
  };

  renderWeekLabels = () => {
    const weekStartDay = moment().startOf('week');
    const dayLabels = [];

    for (let i = 7; i > 0; i--) {
      const dayLabel = weekStartDay.format('dd').toUpperCase();
      dayLabels.push(dayLabel);
      weekStartDay.add(1, 'day');
    }

    return (
      <View style={styles.weekLabelsContainer}>
        {dayLabels.map((item, i) => (
          <Text key={`weekday-${i}`} style={styles.weekLabel}>
            {item}
          </Text>
        ))}
      </View>
    );
  };
}

Month.propTypes = {
  onDayPress: PropTypes.func,
  monthData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired
  }).isRequired
};
