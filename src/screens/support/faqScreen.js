import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Content, H2, Text, Title } from 'native-base';
import { observer } from "mobx-react";
import { Image, View, Dimensions } from 'react-native'
import Video from 'react-native-video';

import HeaderComponent from "../../components/header";
import ActionBarComponent from '../../components/actionBar'
import Icon from '../../components/Icon'
import { actionStyles, icons, colors, sizes, screens, navigationParams } from '../../utils/global'
import supportStore from "../../stores/supportStore";

const DEVICE_WIDTH = Dimensions.get("window").width
const DEVICE_HEIGHT = Dimensions.get("window").height
const MEDIA_RATIO = 1.5
const MEDIA_WIDTH = DEVICE_WIDTH - 40
const MEDIA_HEIGHT = MEDIA_WIDTH / MEDIA_RATIO


@observer
class SupportFaqScreen extends Component {


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
      <Container>
        <HeaderComponent t={t} navigation={navigation} title={t('support:supportTitle')} currentScreen={screens.SUPPORT_FAQ} />
        <View style={{ padding: 20, flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>

          <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: colors.ACTIVE.string(), borderRadius: 5 }}>
            <Title style={{ fontWeight: 'bold' }}>{faq.title}</Title>
          </View>
          {supportStore.hasImage(faq) && (
            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
              <Image source={{ uri: faq.media_urn, height: MEDIA_HEIGHT, width: MEDIA_WIDTH }} resizeMode={Image.resizeMode.contain} />
            </View>
          )}
          {supportStore.hasVideo(faq) && (
            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
              <Video source={{ uri: faq.media_urn }}
                ref={(ref) => {
                  this.player = ref
                }}
                style={{ height: MEDIA_HEIGHT, width: MEDIA_WIDTH }}
                resizeMode={"cover"}
                repeat={true}
                paused={false}
                muted={false}
              />
            </View>
          )}
          <Text>{faq.text}</Text>
        </View>
        <ActionBarComponent actions={actions} />
      </Container>
    );
  }
}
export default translate("translations")(SupportFaqScreen);
