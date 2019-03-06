import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, UFOImage, UFOVideo } from './../../components/common';
import {
  actionStyles,
  icons,
  screens,
  navigationParams,
  dims
} from './../../utils/global';
import { supportStore } from './../../stores';
import UFOCard from './../../components/UFOCard';
import { action, observable } from 'mobx';
import { NavigationEvents } from 'react-navigation';

const styles = StyleSheet.create({
  contentWrapper: {
    paddingTop: dims.CONTENT_PADDING_TOP,
    paddingHorizontal: dims.CONTENT_PADDING_HORIZONTAL
  }
});

@observer
class SupportFaqScreen extends Component {
  @observable refreshing = false;
  @observable faq = null;

  componentWillMount() {
    this.refresh();
  }

  @action
  refresh = async () => {
    this.refreshing = true;

    const { navigation } = this.props;
    const faqCategoryReference = navigation.getParam(
      navigationParams.SUPPORT_FAQ_CATEGORY
    );
    const faqReference = navigation.getParam(navigationParams.SUPPORT_FAQ);
    this.faq = await supportStore.getFaq(faqCategoryReference, faqReference);
    this.refreshing = false;
  };

  render() {
    const { t, navigation } = this.props;
    return (
      <UFOContainer image={screens.SUPPORT_FAQ.backgroundImage}>
        <NavigationEvents onWillFocus={() => this.refresh()} />
        <UFOHeader
          t={t}
          navigation={navigation}
          title={t('support:supportTitle')}
          currentScreen={screens.SUPPORT_FAQ}
        />
        <ScrollView contentContainerStyle={styles.contentWrapper}>
          {this.faq && (
            <UFOCard
              title={this.faq.title}
              text={this.faq.text}
              imageSource={
                supportStore.hasImage(this.faq)
                  ? { uri: this.faq.media_url }
                  : null
              }
              videoSource={
                supportStore.hasVideo(this.faq)
                  ? { uri: this.faq.media_url }
                  : null
              }
            />
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
        <UFOActionBar actions={this.actions} />
      </UFOContainer>
    );
  }

  get actions() {
    return [
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      }
    ];
  }
}

export default translate('translations')(SupportFaqScreen);
