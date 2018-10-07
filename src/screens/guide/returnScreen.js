import React, { Component } from "react";
import { translate } from "react-i18next";
import { RefreshControl, View } from 'react-native'
import { observer } from "mobx-react";
import { observable } from "mobx";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer } from '../../components/common'
import { screens, actionStyles, icons, dims, backgrounds } from '../../utils/global'
import { driveStore, guideStore } from '../../stores'
import UFOCard from "../../components/UFOCard";
import UFOSlider from "../../components/UFOSlider";


@observer
class ReturnScreen extends Component {


  @observable guideIndex = 0

  componentDidMount() {
    this.refresh()
  }

  @observable refreshing = false


  refresh = async () => {
    await guideStore.listReturnGuides()
  }

  renderGuide({ item, index }) {
    let guide = item
    return (
      <UFOCard
        key={guide.reference}
        title={guide.title}
        text={guide.description}
        imageSource={guideStore.hasImage(guide) ? { uri: guide.media_url } : null}
        videoSource={guideStore.hasVideo(guide) ? { uri: guide.media_url } : null} />
    );
  }

  onSnapToItem = async (index) => {
    this.guideIndex = index
  }



  render() {
    const { t, navigation } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.navigate(screens.DRIVE.name)
      }
    ]


    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={this.refresh} />)

    let guides = guideStore.returnGuides


    return (
      <UFOContainer image={backgrounds.RETURN001}>
        <KeyboardAwareScrollView
          refreshControl={_RefreshControl}
        >
          <UFOHeader t={t} navigation={navigation} currentScreen={screens.DRIVE} title={t('guide:returnTitle', { rental: driveStore.rental })} />
          <View style={{ paddingTop: dims.CONTENT_PADDING_TOP }}>
            <UFOSlider data={guides} renderItem={this.renderGuide} onSnapToItem={this.onSnapToItem} />
          </View>
        </KeyboardAwareScrollView >
        <UFOActionBar actions={actions} />
      </UFOContainer >
    );
  }
}


export default translate("translations")(ReturnScreen);

