import React, { Component, Fragment } from 'react';
import { View, Text } from 'react-native';
import { translate } from 'react-i18next';

import BookingNavWrapper from './components/BookingNavWrapper';
import styles from './styles';

class StepBookScreen extends Component {
  render() {
    return (
      <BookingNavWrapper
        navBack={this.navBack}
        currentStep={1}
      >
      </BookingNavWrapper>
    );
  }

  navBack = () => {
    this.props.navigation.navigate(screenKeys.Home);
  };
}

export default translate()(StepBookScreen);
