import React, { Component } from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import DeviceInfo from 'react-native-device-info';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import UFOHeader from './../../components/header/UFOHeader';
import { UFOContainer } from './../../components/common';
import { screens } from './../../utils/global';
import registerStore from './../../stores/registerStore';
import configurations from '../../utils/configurations';
import { driveStore } from '../../stores';

const CHAT_TAWKTO = true;

const styles = StyleSheet.create({
  header: {},
  chatWrapper: { flex: 1, backgroundColor: 'white' },
  chat: { zIndex: 10 }
});

@observer
class ChatScreen extends Component {
  //form NOT CHAT_TAWKTO
  injectjs() {
    const userName = registerStore.user.last_name
      ? `${registerStore.user.first_name} ${registerStore.user.last_name}`
      : registerStore.user.reference;

    const userEmail = registerStore.user.email || '';
    const userPhone = registerStore.user.phone_number || '';
    const userDescription =
      `DeviceCountry: ${DeviceInfo.getDeviceCountry()}, ` +
      `DeviceLocale: ${DeviceInfo.getDeviceLocale()}, ` +
      `DeviceName: ${DeviceInfo.getDeviceName()}, ` +
      `DeviceManufacturer: ${DeviceInfo.getManufacturer()}, ` +
      `DeviceModel: ${DeviceInfo.getModel()}, ` +
      `SystemName: ${DeviceInfo.getSystemName()}, ` +
      `SystemVersion: ${DeviceInfo.getSystemVersion()}, ` +
      `SystemTimezone: ${DeviceInfo.getTimezone()}, ` +
      `IsTablet: ${DeviceInfo.isTablet()}, ` +
      `ApplicationID: ${DeviceInfo.getBundleId()}, ` +
      `ApplicationBuild: ${DeviceInfo.getBuildNumber()}`;

    const method = 'setContactInfo';
    const data = `{\"client_name\": \"${userName}\", \"email\": \"${userEmail}\", \"phone\": \"${userPhone}\",\"description\": \"${userDescription}\"}`;

    return `setTimeout(() => { window.jivo_api.${method}(${data}); }, 1000)`;
  }

  render() {
    // for CHAT_TAWKTO

    let contact = registerStore.user.last_name
      ? `${registerStore.user.first_name} ${registerStore.user.last_name}`
      : registerStore.user.reference;
    if (registerStore.user.email) {
      contact = contact + ` (${registerStore.user.email})`;
    }

    let params = `contact=${contact}`;

    params =
      params +
      `&app=${DeviceInfo.getSystemName()} (${configurations.UFO_APP_NAME}.${
        configurations.UFO_APP_VERSION
      }.${configurations.UFO_APP_BUILD_NUMBER})`;

    params =
      params +
      `&bookings=${driveStore.rentals.map(rental => {
        return rental.reference + ` (${rental.status});`;
      })}`;

    if (
      registerStore.user.email &&
      registerStore.support_chat_identification_key
    ) {
      params =
        params +
        `&email=${registerStore.user.email}&hash=${
          registerStore.support_chat_identification_key
        }`;
    }
    return (
      <UFOContainer style={{ backgroundColor: 'white' }}>
        <UFOHeader
          t={this.props.t}
          navigation={this.props.navigation}
          transparent={true}
          logo={true}
          currentScreen={screens.SUPPORT_CHAT}
          style={styles.header}
        />
        <View style={styles.chatWrapper}>
          {CHAT_TAWKTO === false && (
            <WebView
              source={{
                uri:
                  Platform.OS === 'ios'
                    ? 'index.html'
                    : 'file:///android_asset/chat/index.html'
              }}
              originWhitelist={['*']}
              injectedJavaScript={this.injectjs()}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              style={styles.chat}
              useWebKit={true}
              bounces={false}
            />
          )}
          {CHAT_TAWKTO === true && (
            <WebView
              source={{
                uri: `https://resources.ufodrive.com/support/chat.html?${params}`
              }}
              originWhitelist={['*']}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              useWebKit={false}
              onLoadProgress={e => console.log(e.nativeEvent.progress)}
            />
          )}
          <View style={{ height: 100 }} />
        </View>
        {Platform.OS === 'android' && <KeyboardSpacer />}
      </UFOContainer>
    );
  }
}

export default translate()(ChatScreen);
