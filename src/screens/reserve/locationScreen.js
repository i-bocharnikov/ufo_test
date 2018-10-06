import React, { Component } from "react";
import { translate } from "react-i18next";
import { View, Linking, Clipboard } from 'react-native';

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage } from '../../components/common'
import { screens, actionStyles, icons, dims } from '../../utils/global'
import UFOCard from "../../components/UFOCard";

const bookingUrl = "https://booking.ufodrive.com"

class ReserveLocationScreen extends Component {

  goToURL = async () => {
    Linking.canOpenURL(bookingUrl).then(supported => {
      if (supported) {
        Linking.openURL(bookingUrl);
      } else {
        console.log("Linking not supported for url ", bookingUrl)
      }
    });
  }

  copyToClipboard = async () => {
    await Clipboard.setString(bookingUrl);
  }

  render() {

    const { t, navigation } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME.name)
      },
      {
        style: actionStyles.TODO,
        icon: icons.BROWSE,
        onPress: this.goToURL
      },
    ]
    return (
      <UFOContainer image={screens.RESERVE_LOCATION.backgroundImage}>
        <UFOHeader t={t} navigation={navigation} title={t('reserve:reserveTitle')} currentScreen={screens.RESERVE_LOCATION} />
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
          <View style={{ paddingTop: dims.CONTENT_PADDING_TOP, paddingLeft: '10%', paddingRight: '10%' }} >
            <UFOCard title={t('reserve:bookingLink')}  >
              <UFOText link h2 center onPress={this.goToURL} style={{ paddingTop: 20 }} >{bookingUrl}</UFOText>
            </UFOCard>
          </View>
        </View>
        <UFOActionBar actions={actions} />
      </UFOContainer>

    );
  }
}

export default translate("translations")(ReserveLocationScreen);
