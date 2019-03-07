import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { translate } from 'react-i18next';

import { UFOHeader } from './../../components/UFOHeader';
import { UFOContainer } from './../../components/common';
import styles from './styles';

class GuideScreen extends Component {
  render() {
    return (
      <UFOContainer style={styles.container}>
        <UFOHeader
          title="Guide"
          leftBtnIcon="keyboard-backspace"
          leftBtnAction={this.navBack}
        />
      </UFOContainer>
    );
  }

  navBack = () => {
    this.props.navigation.goBack();
  };
}

export default translate()(GuideScreen);
