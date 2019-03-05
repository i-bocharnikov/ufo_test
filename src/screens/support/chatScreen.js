import React, { Component } from 'react';
import { View, StyleSheet, Platform, WebView, AppState } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import DeviceInfo from 'react-native-device-info';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import UFOHeader from './../../components/header/UFOHeader';
import { UFOContainer, UFOLoader } from './../../components/common';
import { icons, actionStyles, screens } from './../../utils/global';
import { registerStore } from './../../stores';
import remoteLoggerService from './../../utils/remoteLoggerService';

const styles = StyleSheet.create({
  container: { backgroundColor: 'white' },
  chatWrapper: {
    flex: 1,
    backgroundColor: 'white'
  },
  chat: { zIndex: 10 }
});

@observer
class ChatScreen extends Component {
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    remoteLoggerService.info(
      'chatScreen.openChat',
      `JIVO CHAT for User ${
        registerStore.user ? registerStore.user.reference : ''
      } in state ${registerStore.user ? registerStore.user.status : ''}`,
      {},
      registerStore.user
    );
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  render() {
    return (
      <UFOContainer style={styles.container}>
        <UFOHeader
          t={this.props.t}
          navigation={this.props.navigation}
          transparent={true}
          logo={true}
          currentScreen={screens.SUPPORT_CHAT}
          leftAction={{
            style: actionStyles.ACTIVE,
            icon: icons.BACK,
            onPress: () => this.props.navigation.goBack()
          }}
          rightAction={{
            style: actionStyles.ACTIVE,
            icon: icons.HOME,
            onPress: () => this.props.navigation.navigate(screens.HOME.name)
          }}
        />
        <View style={styles.chatWrapper}>
          <WebView
            ref={ref => (this.browser = ref)}
            source={{
              uri: Platform.OS === 'ios'
                ? 'index.html'
                : 'file:///android_asset/chat/index.html'
            }}
            originWhitelist={['*']}
            injectedJavaScript={this.injectjs()}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            style={styles.chat}
            renderLoading={this.renderLoader}
            useWebKit={true}
            bounces={false}
          />
          <View style={{ height: 100 }} />
        </View>
        {Platform.OS === 'android' && <KeyboardSpacer />}
      </UFOContainer>
    );
  }

  renderLoader = () => (
    <UFOLoader
      fallbackToNative={true}
      isVisible={true}
      color="rgba(0,0,0,0.7)"
      size="large"
    />
  );

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

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      remoteLoggerService.warn(
        'chatScreen.handleAppStateChange',
        'App has come to the foreground. We refresh the chat',
        {
          isBrowserUndefined: this.browser === undefined,
          isBrowserNull: this.browser === null
        }
      );

      if (this.browser) {
        this.browser.reload();
      }
    }
  };
}

export default translate()(ChatScreen);
