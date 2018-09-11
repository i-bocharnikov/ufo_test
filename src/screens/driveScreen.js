import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Content } from 'native-base';
import { View, Text } from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'

import HeaderComponent from "../components/header";
import ActionSupportComponent from '../components/actionSupport'
import ActionBarComponent from '../components/actionBar'
import { screens, styles, icons } from '../utils/global'
import driveStore from '../stores/driveStore'

class DriveScreen extends Component {

  render() {
    const { t } = this.props;
    let actions = [
      {
        style: styles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME)
      },
    ]
    return (
      <Container>
        <HeaderComponent t={t} title={t('drive:driveTitle')} subTitle={driveStore.rental.reference + " " + driveStore.rental.status} />
        <ParallaxScrollView
          backgroundColor="blue"
          contentBackgroundColor="pink"
          parallaxHeaderHeight={300}
          renderForeground={() => (
            <View style={{ height: 300, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>Hello World!</Text>
            </View>
          )}>
          <View style={{ height: 500 }}>
            <Text>Scroll me</Text>
          </View>
        </ParallaxScrollView>

        <ActionSupportComponent onPress={() => this.props.navigation.navigate(screens.SUPPORT, { context: screens.DRIVE })} />
        <ActionBarComponent actions={actions} />
      </Container>

    );
  }
}
export default translate("translations")(DriveScreen);
