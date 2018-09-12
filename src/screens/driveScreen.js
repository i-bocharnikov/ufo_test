import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Text } from 'native-base';
import { Dimensions, View, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native'

import HeaderComponent from "../components/header";
import ActionSupportComponent from '../components/actionSupport'
import ActionBarComponent from '../components/actionBar'
import { screens, actionStyles, icons, colors, dateFormats } from '../utils/global'
import configurations from "../utils/configurations"
import driveStore from '../stores/driveStore'
import { observer } from "mobx-react";
import { observable } from "mobx";

const window = Dimensions.get('window');
const BACKGROUND_WIDTH = Dimensions.get('window').width * 1.5
const BACKGROUND_HEIGHT = BACKGROUND_WIDTH / 2
const PARALLAX_HEADER_HEIGHT = window.height;
const STICKY_HEADER_HEIGHT = 70;
const AVATAR_SIZE = 120;

@observer
class DriveScreen extends Component {

  @observable refreshing = false

  render() {
    const { t } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME)
      },
    ]

    let backgroundImageUrl = configurations.UFO_SERVER_API_URL + driveStore.rental.location.image_urn
    let carImageUrl = configurations.UFO_SERVER_API_URL + driveStore.rental.car.car_model.image_front_urn

    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={async () => await driveStore.refresh()} />)

    return (
      <Container>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={_RefreshControl}
        >
          <Image source={{ uri: backgroundImageUrl, width: BACKGROUND_WIDTH, height: BACKGROUND_HEIGHT }} style={{ position: 'absolute', top: 0, }} resizeMode={Image.resizeMode.cover} />
          <HeaderComponent t={t} transparent title={t('drive:driveTitle')} subTitle={driveStore.rental.reference + " " + driveStore.rental.status} />
          <View style={{
            flex: 1, flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center', backgroundColor: colors.BACKGROUND.alpha(0.8).string()
          }}>
            <Text>{driveStore.rental.reference}</Text>
            <Text>{driveStore.format(driveStore.rental.start_at, dateFormats.FULL)}</Text>
            <Text>{driveStore.format(driveStore.rental.end_at, dateFormats.FULL)}</Text>
            <Text>{driveStore.rental.location.name}</Text>

            <Image source={{ uri: carImageUrl, width: 300, height: 158 }} resizeMode={Image.resizeMode.cover} />

            <Text>{driveStore.rental.car.car_model.manufacturer + " " + driveStore.rental.car.car_model.name + " - " + driveStore.rental.car.reference}</Text>

          </View>



        </ScrollView >
        <ActionSupportComponent onPress={() => this.props.navigation.navigate(screens.SUPPORT, { context: screens.DRIVE })} />
        <ActionBarComponent actions={actions} />
      </Container >
    );
  }
}

export default translate("translations")(DriveScreen);



/*         <ParallaxScrollView
          style={{ flex: 1, backgroundColor: 'hotpink', overflow: 'hidden' }}
          renderBackground={() => <Image source={{ uri: backgroundImageUrl, width: BACKGROUND_WIDTH, height: BACKGROUND_HEIGHT }} />}
          renderFixedHeader={() => <HeaderComponent t={t} transparent title={t('drive:driveTitle')} subTitle={driveStore.rental.reference + " " + driveStore.rental.status} />}
          parallaxHeaderHeight={BACKGROUND_HEIGHT}>
          <View style={{ alignItems: 'center' }}><Text style={{ fontSize: 30 }}>Meow!</Text></View>
        </ParallaxScrollView>
 */



/* <ParallaxScrollView
          headerBackgroundColor={colors.BACKGROUND.string()}
          stickyHeaderHeight={STICKY_HEADER_HEIGHT}
          parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
          renderBackground={() => (
            <View key="background">
              <Image source={{
                flex: 1,
                alignSelf: 'center',
                uri: backgroundImageUrl,
                width: BACKGROUND_WIDTH,
                height: BACKGROUND_HEIGHT,
              }} />
              <View style={{
                position: 'absolute',
                top: 0,
                width: window.width,
                backgroundColor: colors.BACKGROUND.alpha(0.7).string(),
                height: PARALLAX_HEADER_HEIGHT
              }} />
            </View>
          )}
          renderForeground={() => (
            <View key="parallax-header" style={styles.parallaxHeader}>
              <HeaderComponent t={t} title={t('drive:driveTitle')} subTitle={driveStore.rental.reference + " " + driveStore.rental.status} />
              <Image style={styles.avatar} source={{
                uri: carImageUrl,
                width: AVATAR_SIZE,
                height: AVATAR_SIZE
              }} />
              <Text style={styles.sectionSpeakerText}>
                Talks by Rich Hickey
              </Text>
              <Text style={styles.sectionTitleText}>
                CTO of Cognitec, Creator of Clojure
              </Text>
            </View>
          )}
        />
        <Content /> */