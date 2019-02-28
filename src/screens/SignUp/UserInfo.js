import React, { Component } from 'react';
import { ScrollView, View, Text, Animated } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';

import { UFOContainer } from './../../components/common';
import styles from './styles';

class UserInfo extends Component {
  render() {
    return (
      <ScrollView>
        <Text>Start</Text>
        <View style={{height: 800}}></View>
        <Text>End</Text>
      </ScrollView>
    );
  }
}

export default translate()(UserInfo);
