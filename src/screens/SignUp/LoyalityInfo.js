import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';

import { registerStore } from './../../stores';
import { UFOContainer, UFOIcon, UFOImage } from './../../components/common';
import styles from './styles';

@observer
class LoyalityInfo extends Component {
  @observable refreshing = false;

  render() {
    return (
      <UFOContainer style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>

        </ScrollView>
      </UFOContainer>
    );
  }
}

export default translate()(LoyalityInfo);
