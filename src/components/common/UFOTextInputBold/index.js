import React, { Component } from 'react';
import {
  TextInput,
  ViewPropTypes,
  TouchableOpacity,
  Text
} from 'react-native';
import PropTypes from 'prop-types';

import { colors } from './../../../utils/theme';
import styles from './styles';

export default class UFOTextInputBold extends Component {
  inputRef = React.createRef();

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
      <TouchableOpacity
        style={[
          styles.container,
          invalidStatus && styles.invalidBorder,
          successStatus && styles.successBorder,
          containerStyle
        ]}
        activeOpacity={1}
        onPress={this.forceFocus}
      >
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
            { ...restInputProps }
            ref={this.inputRef}
          />
        )}
      </TouchableOpacity>
    );
  }

  forceFocus = () => {
    if (this.inputRef && !this.props.InputComponent) {
      this.inputRef.current.focus();
    }
  };
}

UFOTextInputBold.propTypes = {
  style: TextInput.propTypes.style,
  containerStyle: ViewPropTypes.style,
  title: PropTypes.string,
  InputComponent: PropTypes.element,
  invalidStatus: PropTypes.bool,
  successStatus: PropTypes.bool,
  inputComponentRef: PropTypes.object,
  ...TextInput.propTypes
};
