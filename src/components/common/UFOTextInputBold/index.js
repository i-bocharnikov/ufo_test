import React, { Component } from 'react';
import {
  TextInput,
  ViewPropTypes,
  View,
  Text
} from 'react-native';
import PropTypes from 'prop-types';

import { colors } from './../../../utils/theme';
import styles from './styles';

export default class UFOTextInputBold extends Component {
  render() {
    const {
      style,
      containerStyle,
      title,
      InputComponent,
      invalidStatus,
      successStatus,
      ...restInputProps
    } = this.props;

    return (
      <View style={[
        styles.container,
        invalidStatus && styles.invalidBorder,
        successStatus && styles.successBorder,
        containerStyle
      ]}>
        {!!title && (
          <Text style={styles.title}>
            {title}
          </Text>
        )}
        {InputComponent ? InputComponent : (
          <TextInput
            style={[ styles.input, style ]}
            placeholderColor={colors.TEXT_LIGHT_COLOR}
            underlineColorAndroid="transparent"
            {...restInputProps}
          />
        )}
      </View>
    );
  }
}

UFOTextInputBold.propTypes = {
  style: TextInput.propTypes.style,
  containerStyle: ViewPropTypes.style,
  title: PropTypes.string,
  InputComponent: PropTypes.element,
  invalidStatus: PropTypes.bool,
  successStatus: PropTypes.bool,
  ...TextInput.propTypes
};
