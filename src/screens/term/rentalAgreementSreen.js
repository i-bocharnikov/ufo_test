import React, { Component } from "react";
import { translate } from "react-i18next";
import { Dimensions, View, ScrollView, RefreshControl, WebView } from 'react-native'
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import FingerprintScanner from 'react-native-fingerprint-scanner';

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage } from '../../components/common'
import { screens, actionStyles, icons, colors, dateFormats } from '../../utils/global'
import configurations from "../../utils/configurations"
import driveStore from '../../stores/driveStore'
import termStore from "../../stores/termStore";

const window = Dimensions.get('window');
const BACKGROUND_WIDTH = Dimensions.get('window').width * 1.5
const BACKGROUND_HEIGHT = BACKGROUND_WIDTH / 2
const CAR_WIDTH = Dimensions.get('window').width / 2
const CAR_HEIGHT = CAR_WIDTH / 2

@observer
class InspectScreen extends Component {


  async componentDidMount() {
    await this.refresh()
  }


  @action
  refresh = async () => {
    await termStore.getRentalAgreement()
  }

  @action
  sign = async () => {
    if (await termStore.signRentalAgreement()) {
      this.props.navigation.navigate(screens.DRIVE.name)
    }
  }


  render() {
    const { t, navigation } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.CANCEL,
        onPress: () => this.props.navigation.navigate(screens.DRIVE.name)
      },
      {
        style: termStore.term.html ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.SIGN,
        onPress: this.sign
      },
    ]

    return (
      <UFOContainer>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
        >
          <UFOHeader transparent t={t} navigation={navigation} currentScreen={screens.DRIVE} title={t('drive:rentalAgreementTitle', { rental: driveStore.rental })} />
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
            <WebView
              ref={(ref) => { this.webView = ref; }}
              source={{ html: termStore.term.html }}
              style={{ opacity: this.webViewOpacity }}
              javaScriptEnabled={true}
            />
          </View>



        </ScrollView >
        <UFOActionBar actions={actions} />
      </UFOContainer >
    );
  }
}


export default translate("translations")(InspectScreen);

