import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';

import styles from './styles';

class LoyalityInfo extends Component {
  render() {
    return (
      <View>
        <Text>Loyality</Text>
      </View>
    );
  }
}

export default translate()(LoyalityInfo);
