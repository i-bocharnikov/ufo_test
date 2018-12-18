import React, { Component } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { colors, textThemes } from './../../utils/theme';

export const ufoInputStyles = {
  ...textThemes.SP_LIGHT,
  height: 50,
  fontSize: 17,
  backgroundColor: colors.BG_INVERT
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
    backgroundColor: colors.BG_INVERT
  },

  invalidBorder: {
    borderWidth: 1,
    borderColor: colors.ATTENTION_COLOR
  },

  successBorder: {
    borderWidth: 1,
    borderColor: colors.SUCCESS_COLOR
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
      invalidStatus,
      successStatus,
      ...restInputProps
    } = this.props;
    const isClickable = typeof onPress === 'function';

    return (
      <TouchableOpacity
        onPress={isClickable ? onPress : null}
        style={[
          ownStyles.wrapper,
          wrapperStyle,
          invalidStatus && ownStyles.invalidBorder,
          successStatus && ownStyles.successBorder
        ]}
        activeOpacity={isClickable ? 0.8 : 1}
      >
        <TextInput
          style={[ ownStyles.input, style ]}
          placeholderColor={colors.TEXT_LIGHT_COLOR}
          underlineColorAndroid="transparent"
          editable={!isClickable}
          {...restInputProps}
        />
        {IconComponent}
      </TouchableOpacity>
    );
  }
}

UFOTextInput.propTypes = {
  onPress: PropTypes.func,
  isCompleted: PropTypes.bool,
  IconComponent: PropTypes.element,
  wrapperStyle: ViewPropTypes.style,
  invalidStatus: PropTypes.bool,
  successStatus: PropTypes.bool,
  ...TextInput.propTypes
};
