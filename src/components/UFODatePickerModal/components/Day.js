import React, { PureComponent } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import styles from './../styles';
import { values } from './../../../utils/theme';

export default class Day extends PureComponent {
  render() {
    const {
      label,
      price,
      disabled,
      isSelected,
      isSelectedFirst,
      isSelectedLast
    } = this.props.dayData;

    return (
      <TouchableOpacity
        style={[
          styles.dayContainer,
          isSelected && styles.selectedDay,
          isSelectedFirst && styles.selectedFirstDay,
          isSelectedLast && styles.selectedLastDay
        ]}
        onPress={this.onDayPress}
        activeOpacity={!disabled && !isSelected ? values.BTN_OPACITY_DEFAULT : 1}
      >
        <Text style={[
          styles.dayLabel,
          disabled && styles.dayDisabledText,
          isSelected && styles.selectedDayText,
          this.getCustomColorStyles()
        ]}
        >
          {label}
        </Text>
        {!disabled && (
          <Text style={[
            styles.dayPrice,
            disabled && styles.dayDisabledText,
            isSelected && styles.selectedDayText,
            this.getCustomColorStyles()
          ]}
          >
            {price || '-'}
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
  };

  getCustomColorStyles = () => {
    const { customColor, isSelected } = this.props.dayData;

    if (customColor && !isSelected) {
      const style = StyleSheet.create({ customColor: { color: customColor } });
      return style.customColor;
    }

    return null;
  };
}

Day.defaultProps = { dayData: {} };

Day.propTypes = {
  onDayPress: PropTypes.func,
  dayData: PropTypes.shape({
    date: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    available: PropTypes.bool,
    price: PropTypes.string,
    customColor: PropTypes.string,
    isSelected: PropTypes.bool,
    isSelectedFirst: PropTypes.bool,
    isSelectedLast: PropTypes.bool
  }).isRequired
};
