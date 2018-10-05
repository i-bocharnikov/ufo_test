import React, { Component } from "react";
import { translate } from "react-i18next";
import { Dimensions, View, ScrollView, RefreshControl, WebView } from 'react-native'
import { observer } from "mobx-react";
import { observable, action } from "mobx";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage } from '../../components/common'
import { screens, actionStyles, icons, colors, dateFormats } from '../../utils/global'
import { driveStore, termStore } from '../../stores'
import { confirm } from "../../utils/interaction";

const window = Dimensions.get('window');
const BACKGROUND_WIDTH = Dimensions.get('window').width * 1.5
const BACKGROUND_HEIGHT = BACKGROUND_WIDTH / 2
const CAR_WIDTH = Dimensions.get('window').width / 2
const CAR_HEIGHT = CAR_WIDTH / 2

@observer
class InspectScreen extends Component {

  @observable refreshing = false

  async componentDidMount() {
    await this.refresh()
  }


  @action
  refresh = async () => {
    this.refreshing = true
    await termStore.getRentalAgreement()
    this.refreshing = false
  }

  @action
  doSign = async (t) => {
    if (await termStore.signRentalAgreement()) {
      await driveStore.refreshRental()
      this.props.navigation.navigate(screens.DRIVE.name)
    }
  }

  confirmContractSignature = async (t) => {
    await confirm(t('global:confirmationTitle'), t('term:confirmContractSignatureConfirmationMessage'), async () => {
      this.doSign(t)
    })
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
        onPress: () => this.confirmContractSignature(t)
      },
    ]

    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={this.refresh} />)

    return (
      <UFOContainer image={screens.RENTAL_AGREEMENT.backgroundImage}>
        <UFOHeader t={t} navigation={navigation} currentScreen={screens.DRIVE} title={t('term:rentalAgreementTitle', { rental: driveStore.rental })} />
        <WebView
          ref={(ref) => { this.webView = ref; }}
          source={{ html: termStore.term.html }}
        />
        <UFOActionBar actions={actions} inverted />
      </UFOContainer >
    );
  }
}


export default translate("translations")(InspectScreen);

