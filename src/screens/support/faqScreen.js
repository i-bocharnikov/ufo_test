import React, { Component } from "react";
import { translate } from "react-i18next";
import { observer } from "mobx-react";
import { View } from 'react-native'

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOImage } from '../../components/common'
import { actionStyles, icons, screens, navigationParams } from '../../utils/global'
import supportStore from "../../stores/supportStore";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import UFOCard from "../../components/UFOCard";
import UFOVideo from "../../components/common/UFOVideo";




@observer
class SupportFaqScreen extends Component {


  renderImage(faq) {
    return supportStore.hasImage(faq) ? (<UFOImage source={{ uri: faq.media_url }} />) : null
  }

  renderVideo(faq) {
    return supportStore.hasVideo(faq) ? (<UFOVideo source={{ uri: faq.media_url }} />) : null
  }

  renderText(faq) {
    return (
      <View>
        {faq.title && (
          <UFOText h2 numberOfLines={2}
          >
            {title.toUpperCase()}
          </UFOText>
        )}
        {faq.description && (
          <UFOText h3 numberOfLines={2}
          >
            {faq.description}
          </UFOText>
        )}
      </View>
    )
  }


  render() {
    const { t, navigation } = this.props;

    let faqCategoryReference = this.props.navigation.getParam(navigationParams.SUPPORT_FAQ_CATEGORY);
    let faqReference = this.props.navigation.getParam(navigationParams.SUPPORT_FAQ);

    let faq = supportStore.getFaq(faqCategoryReference, faqReference)
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      },
    ]
    return (
      <UFOContainer image={require('../../assets/images/background/UFOBGSUPPORT001.png')}>
        <UFOHeader t={t} navigation={navigation} title={t('support:supportTitle')} currentScreen={screens.SUPPORT_FAQ} />
        <KeyboardAwareScrollView>
          <View style={{ paddingTop: "10%", paddingHorizontal: "10%" }}>
            <UFOCard
              title={faq.title}
              text={faq.text}
              imageSource={supportStore.hasImage(faq) ? { uri: faq.media_url } : null}
              videoSource={supportStore.hasVideo(faq) ? { uri: faq.media_url } : null} />
          </View>
        </KeyboardAwareScrollView>
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }
}
export default translate("translations")(SupportFaqScreen);
