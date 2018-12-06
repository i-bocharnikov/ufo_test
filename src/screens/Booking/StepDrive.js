import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';

import { keys as screenKeys } from './../../navigators/helpers';
import { UFOContainer } from './../../components/common';
import BookingNavWrapper from './components/BookingNavWrapper';
import styles from './styles';

class StepDriveScreen extends Component {
  render() {
    return (
      <BookingNavWrapper
        navBack={this.navBack}
        currentStep={3}
      >
        <UFOContainer style={styles.screenContainer}>
          <Text>Step 3</Text>
        </UFOContainer>
      </BookingNavWrapper>
    );
  }

  navBack = () => {
    this.props.navigation.goBack();
  };
}

export default translate()(StepDriveScreen);
