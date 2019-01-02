import React, { Component } from 'react';
import { WebView, View, StyleSheet, Platform } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import DeviceInfo from 'react-native-device-info';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer } from './../../components/common';
import { actionStyles, icons, screens } from './../../utils/global';
import registerStore from './../../stores/registerStore';

const chatSource = require('./../../assets/chat/index.html');
const styles = StyleSheet.create({
  header: { backgroundColor: 'transparent' },
  chatWrapper: { flex: 1 },
  chat: { zIndex: 10 }
});

@observer
class ChatScreen extends Component {
  injectjs() {
    const userName = registerStore.user.last_name
      ? `${registerStore.user.first_name} ${registerStore.user.last_name}`
      : registerStore.user.reference;

    const userEmail = registerStore.user.email || '';
    const userPhone = registerStore.user.phone_number || '';
    const userDescription = `DeviceCountry: ${DeviceInfo.getDeviceCountry()}, `
      + `DeviceLocale: ${DeviceInfo.getDeviceLocale()}, `
      + `DeviceName: ${DeviceInfo.getDeviceName()}, `
      + `DeviceManufacturer: ${DeviceInfo.getManufacturer()}, `
      + `DeviceModel: ${DeviceInfo.getModel()}, `
      + `SystemName: ${DeviceInfo.getSystemName()}, `
      + `SystemVersion: ${DeviceInfo.getSystemVersion()}, `
      + `SystemTimezone: ${DeviceInfo.getTimezone()}, `
      + `IsTablet: ${DeviceInfo.isTablet()}, `
      + `ApplicationID: ${DeviceInfo.getBundleId()}, `
      + `ApplicationBuild: ${DeviceInfo.getBuildNumber()}`;

    const method = 'setContactInfo';
    const data = `{\"client_name\": \"${
      userName
    }\", \"email\": \"${
      userEmail
    }\", \"phone\": \"${
      userPhone
    }\",\"description\": \"${
      userDescription
    }\"}`;

    return `setTimeout(() => { window.jivo_api.${method}(${data}); }, 1000)`;
  }

  render() {
    return (
      <UFOContainer image={screens.SUPPORT_CHAT.backgroundImage}>
        <UFOHeader
          t={this.props.t}
          navigation={this.props.navigation}
          transparent={true}
          logo={true}
          currentScreen={screens.SUPPORT_CHAT}
          style={styles.header}
        />
        <View style={styles.chatWrapper}>
          <WebView
            source={chatSource}
            originWhitelist={[ '*' ]}
            injectedJavaScript={this.injectjs()}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            style={styles.chat}
            useWebKit={true}
            bounces={false}
          />
        </View>
        {Platform.OS === 'android' && <KeyboardSpacer />}
        <UFOActionBar actions={this.actions} />
      </UFOContainer>
    );
  }

  get actions() {
    return [{
      style: actionStyles.ACTIVE,
      icon: icons.BACK,
      onPress: () => this.props.navigation.pop()
    }];
  }
}

export default translate()(ChatScreen);
