import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { values, textThemes, colors } from './../../utils/theme';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.TEXT_DEFAULT_COLOR,
    marginRight: 12
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.TEXT_DEFAULT_COLOR,
  },
  label: {
    ...textThemes.SP_SEMIBOLD,
    fontSize: 13,
    letterSpacing: 0.32
  }
});

export default class UFOCheckBoxItem extends PureComponent {
  render() {
    const { onCheck, isChecked, label, wrapperStyle } = this.props;

    return (
      <TouchableOpacity
        onPress={onCheck}
        style={[styles.item, wrapperStyle]}
        activeOpacity={values.BTN_OPACITY_DEFAULT}
      >
        <View style={styles.circle}>
          {isChecked && <View style={styles.dot} />}
        </View>
        <Text style={styles.label}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }
}

UFOCheckBoxItem.propTypes = {
  isChecked: PropTypes.bool,
  onCheck: PropTypes.func,
  label: PropTypes.string,
  wrapperStyle: ViewPropTypes.style
};
