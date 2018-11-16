import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';

import { UFOContainer } from './../../components/common';
import styles from './styles';

class StepDriveScreen extends Component {
  render() {
    return (
      <View>
        <Text>Step 2</Text>
      </View>
    );
  }
}

export default translate()(StepDriveScreen);
