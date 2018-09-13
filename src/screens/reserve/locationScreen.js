import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Content } from 'native-base';
import { Dimensions, View, Text, ImageBackground, Image, StyleSheet } from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'

import HeaderComponent from "../../components/header";
import ActionBarComponent from '../../components/actionBar'
import { screens, actionStyles, icons, supportContexts } from '../../utils/global'

class ReserveLocationScreen extends Component {

  render() {

    const { t, navigation } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME)
      },
      {
        style: actionStyles.TODO,
        icon: icons.NEXT,
        onPress: () => this.props.navigation.navigate(screens.RESERVE_DATE_AND_CAR)
      },
    ]
    return (
      <Container>
        <HeaderComponent t={t} navigation={navigation} title={t('register:reserveLocationTitle')} supportContext={supportContexts.RESERVE} />

        <View style={{ flex: 1 }}>
          <View style={{ height: 60, backgroundColor: 'green' }} />
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ width: 60, backgroundColor: 'red' }} />
            <ParallaxScrollView
              style={{ flex: 1, backgroundColor: 'hotpink', overflow: 'hidden' }}
              renderBackground={() => <Image source={{ uri: `https://placekitten.com/414/350`, width: window.width, height: 350 }} />}
              renderFixedHeader={() => <Text style={{ textAlign: 'right', color: 'white', padding: 5, fontSize: 20 }}>Hello</Text>}
              parallaxHeaderHeight={350}>
              <View style={{ alignItems: 'center' }}><Text style={{ fontSize: 30 }}>Meow!</Text></View>
            </ParallaxScrollView>
            <View style={{ width: 60, backgroundColor: 'orange' }} />
          </View>
          <View style={{ height: 60, backgroundColor: 'blue' }} />
        </View>
        <ActionBarComponent actions={actions} />
      </Container>

    );
  }
}

export default translate("translations")(ReserveLocationScreen);
