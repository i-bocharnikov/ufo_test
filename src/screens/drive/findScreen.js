import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Text, Title } from 'native-base';
import { Dimensions, View, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { observer } from "mobx-react";
import { observable } from "mobx";
import Video from 'react-native-video';

import HeaderComponent from "../../components/header";
import ActionBarComponent from '../../components/actionBar'
import { screens, actionStyles, icons, colors, dateFormats } from '../../utils/global'
import configurations from "../../utils/configurations"
import driveStore from '../../stores/driveStore'

const DEVICE_WIDTH = Dimensions.get("window").width
const DEVICE_HEIGHT = Dimensions.get("window").height
const MEDIA_RATIO = 1.5
const MEDIA_WIDTH = DEVICE_WIDTH - 40
const MEDIA_HEIGHT = MEDIA_WIDTH / MEDIA_RATIO

@observer
class FindScreen extends Component {

  componentDidMount() {
    this.refresh()
  }

  @observable refreshing = false


  refresh = async () => {
    await driveStore.listFindGuides()
  }

  render() {
    const { t, navigation } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      },
    ]

    let guides = driveStore.findGuides
    let guide = guides.length > 0 ? guides[0] : {}


    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={this.refresh} />)

    return (
      <Container>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={_RefreshControl}
        >
          <HeaderComponent transparent t={t} navigation={navigation} currentScreen={screens.DRIVE} title={t('drive:findTitle', { rental: driveStore.rental })} />
          <View style={{ padding: 20, flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>

            <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center', alignContent: 'center', backgroundColor: colors.ACTIVE.string(), borderRadius: 5 }}>
              <Title style={{ fontWeight: 'bold' }}>{guide.title}</Title>
            </View>
            {driveStore.hasImage(guide) && (
              <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                <Image source={{ uri: guide.media_urn, height: MEDIA_HEIGHT, width: MEDIA_WIDTH }} resizeMode={Image.resizeMode.contain} />
              </View>
            )}
            {driveStore.hasVideo(guide) && (
              <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                <Video source={{ uri: guide.media_urn }}
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
            <Text>{guide.description}</Text>
          </View>



        </ScrollView >
        <ActionBarComponent actions={actions} />
      </Container >
    );
  }
}


export default translate("translations")(FindScreen);

