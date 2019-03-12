import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import { supportStore } from './../../stores';
import { UFOHeader, UFOSubHeader, UFOHeaderStickyWrapper } from './../../components/UFOHeader';
import { UFOContainer } from './../../components/common';
import styles from './styles';

@observer
class GuideScreen extends Component {
  render() {
    return (
      <UFOContainer style={styles.container}>
        <UFOHeaderStickyWrapper>
          <UFOHeader
            isSingle={false}
            title={this.props.t('guideHeader')}
            leftBtnIcon="keyboard-backspace"
            leftBtnAction={this.navBack}
          />
          <UFOSubHeader subHeader={supportStore.guideCategorytitle} />
          {this.renderContent()}
        </UFOHeaderStickyWrapper>
      </UFOContainer>
    );
  }

  renderContent = () => {
    return (
      <View></View>
    );
  };

  navBack = () => {
    this.props.navigation.goBack();
  };
}

export default translate('support')(GuideScreen);
