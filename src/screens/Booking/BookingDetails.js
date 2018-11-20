import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';

import styles from './styles';

class BookingDetailsScreen extends Component {
  render() {
    return (
      <View>
        <Text>
            Screen where will be description for cars and locations
        </Text>
      </View>
    );
  }
}

export default translate()(BookingDetailsScreen);
