import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import { supportStore } from './../../stores';
import { UFOHeader, UFOSubHeader, UFOHeaderStickyWrapper } from './../../components/UFOHeader';
import { UFOContainer, UFOImage, UFOVideo } from './../../components/common';
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
    if (!supportStore.chosenGuide) {
      return null;
    }

    const { title, text, media_type, media_url } = supportStore.chosenGuide;
    const hasImageContent = media_type === 'image' || media_type === 'external_map';
    const hasVideoContent = media_type === 'video';

    return (
      <View style={styles.guideContentWrapper}>
        {hasImageContent && (
          <UFOImage
            source={{ uri: media_url }}
            style={styles.guideMedia}
          />
        )}
        {hasVideoContent && (
          <UFOVideo
            source={{ uri: media_url }}
            style={styles.guideMedia}
          />
        )}
        <Text style={styles.guideTitle}>
          {title.toUpperCase()}
        </Text>
        <Text style={styles.guideDescription}>
          {text}
        </Text>
      </View>
    );
  };

  navBack = () => {
    this.props.navigation.goBack();
  };
}

export default translate('support')(GuideScreen);
