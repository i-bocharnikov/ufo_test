import React, { Component } from "react";
import { translate } from "react-i18next";
import { View, Linking } from 'react-native';

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage } from '../../components/common'
import { screens, actionStyles, icons } from '../../utils/global'

const bookingUrl = "https://booking.ufodrive.com"

class ReserveLocationScreen extends Component {

  goToURL = () => {
    Linking.canOpenURL(bookingUrl).then(supported => {
      if (supported) {
        Linking.openURL(bookingUrl);
      } else {
        console.warn("Linking not supported for url ", bookingUrl)
      }
    });
  }

  render() {

    const { t, navigation } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME.name)
      }
    ]
    return (
      <UFOContainer image={require("../../assets/images/background/UFOBGRESERVE001.png")}>
        <UFOHeader t={t} navigation={navigation} title={t('reserve:reserveTitle')} currentScreen={screens.RESERVE_LOCATION} />
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
          <View style={{ paddingTop: '10%', paddingLeft: '10%', paddingRight: '10%' }} >
            <UFOText h1 inverted center style={{ paddingTop: 10 }}>{t('reserve:bookingLink')}</UFOText>
            <UFOText style={{ color: '#acacac', fontWeight: 'bold' }} onPress={this.goToURL}>{bookingUrl}</UFOText>
          </View>
        </View>
        <UFOActionBar actions={actions} />
      </UFOContainer>

    );
  }
}

export default translate("translations")(ReserveLocationScreen);
