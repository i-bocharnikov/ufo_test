import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { translate } from 'react-i18next';

import { UFOContainer } from './../../components/common';
import styles from './styles';

class FaqScreen extends Component {
  render() {
    return (
      <UFOContainer style={styles.container}>
        <Text>
          FaqScreen
        </Text>
      </UFOContainer>
    );
  }
}

export default translate()(FaqScreen);
