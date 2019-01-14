import React, { Component } from 'react';
import {
  TextInput,
  TouchableOpacity,
  ViewPropTypes,
  View,
  Text,
  LayoutAnimation
} from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { colors } from './../../../utils/theme';
import styles from './styles';

export default class UFOTextInput extends Component {
  componentDidUpdate(prevProps) {
    if (
      this.props.alertMessage && !prevProps.alertMessage
      || !this.props.alertMessage && prevProps.alertMessage
    ) {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.linear,
        duration: 120
      });
    }
  }

  render() {
    const {
      style,
      wrapperStyle,
      containerStyle,
      alertStyle,
      onPress,
      IconComponent,
      invalidStatus,
      successStatus,
      alertMessage,
      ...restInputProps
    } = this.props;
    const isClickable = typeof onPress === 'function';

    return (
      <View style={containerStyle}>
        <TouchableOpacity
          onPress={isClickable ? onPress : null}
          style={[
            styles.wrapper,
            wrapperStyle,
            invalidStatus && styles.invalidBorder,
            successStatus && styles.successBorder
          ]}
          activeOpacity={isClickable ? 0.8 : 1}
        >
          <TextInput
            style={[ styles.input, style ]}
            placeholderColor={colors.TEXT_LIGHT_COLOR}
            underlineColorAndroid="transparent"
            editable={!isClickable}
            pointerEvents={isClickable ? 'none' : 'auto'}
            {...restInputProps}
          />
          {IconComponent}
        </TouchableOpacity>
        {!!alertMessage && _.isString(alertMessage) && (
          <Text style={[ styles.errorLabel, alertStyle ]}>
            {alertMessage}
          </Text>
        )}
      </View>
    );
  }
}

UFOTextInput.propTypes = {
  /* input field styles */
  style: TextInput.propTypes.style,
  /* input wrapper styles (can be used instead `containerStyle` if `alertMessage` not using) */
  wrapperStyle: ViewPropTypes.style,
  /* component container styles (contain input and alert label) */
  containerStyle: ViewPropTypes.style,
  /* alert label styles (by default used error styles) */
  alertStyle: Text.propTypes.style,
  onPress: PropTypes.func,
  IconComponent: PropTypes.element,
  invalidStatus: PropTypes.bool,
  successStatus: PropTypes.bool,
  alertMessage: PropTypes.string,
  ...TextInput.propTypes
};
