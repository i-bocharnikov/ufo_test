import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, UFOImage, UFOVideo } from './../../components/common';
import { actionStyles, icons, screens, navigationParams, dims } from './../../utils/global';
import supportStore from './../../stores/supportStore';
import UFOCard from './../../components/UFOCard';

const styles = StyleSheet.create({
  contentWrapper: {
    paddingTop: dims.CONTENT_PADDING_TOP,
    paddingHorizontal: dims.CONTENT_PADDING_HORIZONTAL
  }
});

@observer
class SupportFaqScreen extends Component {
  render() {
    const { t, navigation } = this.props;
    const faqCategoryReference = navigation.getParam(navigationParams.SUPPORT_FAQ_CATEGORY);
    const faqReference = navigation.getParam(navigationParams.SUPPORT_FAQ);
    const faq = supportStore.getFaq(faqCategoryReference, faqReference);

    return (
      <UFOContainer image={screens.SUPPORT_FAQ.backgroundImage}>
        <UFOHeader
          t={t}
          navigation={navigation}
          title={t('support:supportTitle')}
          currentScreen={screens.SUPPORT_FAQ}
        />
        <ScrollView contentContainerStyle={styles.contentWrapper}>
          <UFOCard
            title={faq.title}
            text={faq.text}
            imageSource={supportStore.hasImage(faq) ? { uri: faq.media_url } : null}
            videoSource={supportStore.hasVideo(faq) ? { uri: faq.media_url } : null}
          />
        </ScrollView>
        <UFOActionBar actions={this.actions} />
      </UFOContainer>
    );
  }

  get actions() {
    return [{
      style: actionStyles.ACTIVE,
      icon: icons.BACK,
      onPress: () => this.props.navigation.pop()
    }];
  }
}

export default translate('translations')(SupportFaqScreen);
