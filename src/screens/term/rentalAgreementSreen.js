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

    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={this.refresh} />)

    return (
      <UFOContainer image={require('../../assets/images/background/UFOBGDRIVE001.png')}>
        <UFOHeader t={t} navigation={navigation} currentScreen={screens.DRIVE} title={t('drive:rentalAgreementTitle', { rental: driveStore.rental })} />
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          resetScrollToCoords={{ x: 0, y: 0 }}
          refreshControl={_RefreshControl}>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center', backgroundColor: 'green' }}>
            <WebView
              ref={(ref) => { this.webView = ref; }}
              source={{ html: termStore.term.html }}
              style={{ backgroundColor: 'red' }}
            //javaScriptEnabled={true}
            />
          </View>
        </KeyboardAwareScrollView >
        <UFOActionBar actions={actions} />
      </UFOContainer >
    );
  }
}


export default translate("translations")(InspectScreen);

