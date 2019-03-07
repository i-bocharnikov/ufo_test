import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { translate } from 'react-i18next';

import { UFOContainer } from './../../components/common';
import styles from './styles';

class GuideListScreen extends Component {
  render() {
    return (
      <UFOContainer style={styles.container}>
        <Text>
          GuideListScreen
        </Text>
      </UFOContainer>
    );
  }
}

export default translate()(GuideListScreen);
