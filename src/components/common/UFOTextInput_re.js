import React, { Component } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import PropTypes from 'prop-types';

import { colors, fonts } from './../../utils/global';

const ownStyles = StyleSheet.create({
  input: {
    width: '100%',
    height: 55,
    backgroundColor: colors.INPUT_BG,
    paddingHorizontal: 24,
    fontSize: 17,
    fontFamily: fonts.LIGHT,
    color: colors.TEXT_DARK,
  },
});

export default class UFOTextInput extends Component {
  render() {
    const { style, ...restInputProps } = this.props;

    return (
      <View>
        <TextInput
          style={[ownStyles.input, style]}
          placeholderColor={colors.DISABLE}
          underlineColorAndroid="transparent"
          { ...restInputProps }
        />
      </View>
    )
  }
}

UFOTextInput.propTypes = {
  style: PropTypes.any,
};
