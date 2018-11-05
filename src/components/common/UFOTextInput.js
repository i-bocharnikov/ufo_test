import React, { Component } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { colors, fonts } from './../../utils/global';

export const ufoInputStyles = {
  height: 50,
  fontSize: 17,
  fontFamily: fonts.LIGHT,
  color: colors.TEXT_DARK,
  backgroundColor: colors.INPUT_BG
};

const ownStyles = StyleSheet.create({
  input: {
    flex: 1,
    ...ufoInputStyles,
    backgroundColor: 'transparent'
  },

  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 12,
    backgroundColor: colors.INPUT_BG
  }
});

export default class UFOTextInput extends Component {
  render() {
    const {
      onPress,
      isCompleted,
      IconComponent,
      wrapperStyle,
      style,
      ...restInputProps
    } = this.props;
    const isClickable = typeof onPress === 'function';

    return (
      <TouchableOpacity
        onPress={isClickable ? onPress : null}
        style={[ownStyles.wrapper, wrapperStyle]}
        activeOpacity={isClickable ? 0.8 : 1}
      >
        <TextInput
          style={[ownStyles.input, style]}
          placeholderColor={colors.DISABLE}
          underlineColorAndroid="transparent"
          editable={!isClickable}
          { ...restInputProps }
        />
        {IconComponent}
      </TouchableOpacity>
    )
  }
}

UFOTextInput.propTypes = {
  onPress: PropTypes.func,
  isCompleted: PropTypes.bool,
  IconComponent: PropTypes.element,
  wrapperStyle: ViewPropTypes.style,
  ...TextInput.propTypes
};
