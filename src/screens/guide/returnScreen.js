import React, { Component } from "react";
import { translate } from "react-i18next";
import { Dimensions, View, ScrollView, RefreshControl } from 'react-native'
import { observer } from "mobx-react";
import { observable } from "mobx";
import Video from 'react-native-video';
import Carousel from 'react-native-snap-carousel';

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage } from '../../components/common'
import { screens, actionStyles, icons, colors } from '../../utils/global'
import guideStore from '../../stores/guideStore'
import driveStore from '../../stores/driveStore'

const DEVICE_WIDTH = Dimensions.get("window").width
const DEVICE_HEIGHT = Dimensions.get("window").height
const MEDIA_RATIO = 1.5
const MEDIA_WIDTH = DEVICE_WIDTH - 60
const MEDIA_HEIGHT = MEDIA_WIDTH / MEDIA_RATIO

@observer
class ReturnScreen extends Component {

  componentDidMount() {
    this.refresh()
  }

  @observable refreshing = false


  refresh = async () => {
    await guideStore.listReturnGuides()
  }


  _renderItem({ item, index }) {
    let guide = item
    return (
      <View key={guide.reference} style={{ paddingTop: 20, flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
        <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: colors.ACTIVE.string(), borderRadius: 5 }}>
          <UFOText inverted h2>{guide.title}</UFOText>
        </View>
        {guideStore.hasImage(guide) && (
          <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
            <UFOImage source={{ uri: guide.media_url }} style={{ height: MEDIA_HEIGHT, width: MEDIA_WIDTH }} />
          </View>
        )}
        {guideStore.hasVideo(guide) && (
          <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
            <Video source={{ uri: guide.media_url }}
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
        <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
          <UFOText>{guide.description}</UFOText>
        </View>
      </View>
    );
  }

  render() {
    const { t, navigation } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.navigate(screens.DRIVE.name)
      },
      {
        style: actionStyles.ACTIVE,
        icon: icons.SLIDE_PREVIOUS,
        onPress: () => this._carousel.snapToPrev()
      },
      {
        style: actionStyles.TODO,
        icon: icons.SLIDE_NEXT,
        onPress: () => this._carousel.snapToNext()
      },
    ]

    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={this.refresh} />)

    let guides = guideStore.returnGuides


    return (
      <UFOContainer>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={_RefreshControl}
        >
          <UFOHeader transparent t={t} navigation={navigation} currentScreen={screens.DRIVE} title={t('drive:returnTitle', { rental: driveStore.rental })} />
          <Carousel
            ref={(c) => { this._carousel = c; }}
            data={guides}
            renderItem={this._renderItem}
            sliderWidth={DEVICE_WIDTH}
            itemWidth={MEDIA_WIDTH}
          />

        </ScrollView >
        <UFOActionBar actions={actions} />
      </UFOContainer >
    );
  }
}


export default translate("translations")(ReturnScreen);

