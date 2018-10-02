import React, { Component } from "react";
import { translate } from "react-i18next";
import { observer } from "mobx-react";
import { View, KeyboardAvoidingView, Dimensions, ScrollView } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage } from '../../components/common'
import { actionStyles, icons, colors, sizes, screens, navigationParams } from '../../utils/global'
import registerStore from "../../stores/registerStore";
import { WebView } from 'react-native';
import { observable } from "mobx";

@observer
class ChatScreen extends Component {

  async componentDidMount() {

  }

  //sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  injectjs() {
    let userName = registerStore.user.last_name ? (registerStore.user.first_name + registerStore.user.last_name) : registerStore.user.reference
    let userEmail = registerStore.user.email ? registerStore.user.email : ""
    let userPhone = registerStore.user.phone_number ? registerStore.user.phone_number : ""
    let userDescription = `DeviceCountry: ${DeviceInfo.getDeviceCountry()}, DeviceLocale: ${DeviceInfo.getDeviceLocale()}, DeviceName: ${DeviceInfo.getDeviceName()}, DeviceManufacturer: ${DeviceInfo.getManufacturer()}, DeviceModel: ${DeviceInfo.getModel()}, SystemName: ${DeviceInfo.getSystemName()}, SystemVersion: ${DeviceInfo.getSystemVersion()}, SystemTimezone: ${DeviceInfo.getTimezone()}, IsTablet: ${DeviceInfo.isTablet()}, ApplicationID: ${DeviceInfo.getBundleId()}, ApplicationBuild: ${DeviceInfo.getBuildNumber()}`
    let method = `setContactInfo`
    let data = `{\"client_name\": \"${userName}\", \"email\": \"${userEmail}\", \"phone\": \"${userPhone}\",\"description\": \"${userDescription}\"}`

    let jsCode = `setTimeout(() => {window.jivo_api.${method}(${data});}, 1000)`;

    return jsCode;
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
    return (
      <UFOContainer image={require('../../assets/images/background/UFOBGSUPPORT001.png')}>
        <UFOHeader transparent logo t={t} navigation={navigation} currentScreen={screens.SUPPORT_CHAT} style={{ backgroundColor: 'transparent' }} />
        <View style={{ flex: 0.5 }}>
          <WebView
            ref={(ref) => { this.webView = ref; }}
            source={require('./assets/index.html')}
            injectedJavaScript={this.injectjs()}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}

          />
        </View>
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }
}
export default translate("translations")(ChatScreen);
