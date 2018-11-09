import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';

import { keys as screenKeys } from './../../navigators/helpers';
import { UFOContainer } from './../../components/common';
import styles from './styles';

class Step1BookScreen extends Component {
  render() {
    const { t, navigation } = this.props;
    console.log('NAV', navigation);

    return (
      <View>
        <Text>Step 1</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate({routeName: screenKeys.BookingStep2Pay})}
        >
          <Text>NAV_TO_STEP_2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate({routeName: screenKeys.Drive})}
        >
          <Text>NAV_BACK</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default translate()(Step1BookScreen);
