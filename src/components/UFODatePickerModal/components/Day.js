import React, { PureComponent } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

import styles from './../styles';
import { values } from './../../../utils/theme';

export default class Day extends PureComponent {
  render() {
    const { dayData } = this.props;
    const isActiveOpacity = !dayData.disabled && dayData.available && !dayData.isSelected;

    return (
      <TouchableOpacity
        style={[
          styles.dayContainer,
          dayData.isSelected && styles.selectedDay,
          dayData.isSelectedFirst && styles.selectedFirstDay,
          dayData.isSelectedLast && styles.selectedLastDay
        ]}
        onPress={this.onDayPress}
        activeOpacity={isActiveOpacity ? values.BTN_OPACITY_DEFAULT : 1}
      >
        <Text style={[
          styles.dayLabel,
          dayData.disabled && styles.dayDisabledText,
          !dayData.available && styles.dayforbiddenText,
          dayData.isSelected && styles.selectedDayText
        ]}
        >
          {dayData.label}
        </Text>
        {!dayData.disabled && (
          <Text style={[
            styles.dayPrice,
            dayData.disabled && styles.dayDisabledText,
            dayData.isSelected && styles.selectedDayText
          ]}
          >
            {dayData.price || '-'}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  onDayPress = () => {
    const { dayData, onDayPress } = this.props;

    if (!dayData.disabled && typeof onDayPress === 'function') {
      onDayPress(dayData.date);
    }
  }
}

Day.propTypes = {
  onDayPress: PropTypes.func,
  dayData: PropTypes.shape({
    date: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    available: PropTypes.bool,
    price: PropTypes.string,
    isSelected: PropTypes.bool,
    isSelectedFirst: PropTypes.bool,
    isSelectedLast: PropTypes.bool
  }).isRequired
};
