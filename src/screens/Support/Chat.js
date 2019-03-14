import React, { Component } from 'react';
import { WebView, Text, View, Platform, Keyboard, AppState } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';

import { registerStore } from './../../stores';
import { UFOLoader, UFOContainer } from './../../components/common';
import styles from './styles';

@observer
class ChatScreen extends Component {
  @observable isKeyboardOpen = false;
  @observable isFocused = true;

  chatRef = React.createRef();
  keyboardShowListener = null;
  keyboardHideListener = null;
  /* when tab more than 'delayBeforeBlur' ms is unfocused - remove webview from render */
  delayBeforeBlur = 5000;
  timerBlur = null;
  didFocusListener = null;
  didBlurListener = null;

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.keyboardShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    this.didFocusListener = this.props.navigation.addListener('didFocus', this.onScreenFocus);
    this.didBlurListener = this.props.navigation.addListener('didBlur', this.onScreenBlur);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
    this.didFocusListener.remove();
    this.didBlurListener.remove();
  }

  render() {
    return (
      <UFOContainer style={styles.container}>
        {this.isFocused && (
          <WebView
            ref={this.chatRef}
            source={{ uri: Platform.select({
              ios: 'index.html',
              android: 'file:///android_asset/chat/index.html'
            })}}
            originWhitelist={['*']}
            useWebKit={true}
            style={styles.webView}
            renderError={this.renderError}
            startInLoadingState={true}
            renderLoading={this.renderLoading}
            domStorageEnabled={true}
            bounces={false}
            injectedJavaScript={this.injectjs}
            contentInset={{ bottom: this.contentInsetBottom }}
          />
        )}
      </UFOContainer>
    );
  }

  renderError = () => (
    <View style={styles.webviewErrorWrapper}>
      <Text style={styles.webviewError}>
        {this.props.t('webViewChatError')}
      </Text>
    </View>
  );

  renderLoading = () => (
    <UFOLoader
      isVisible={true}
      isModal={false}
      {...Platform.select({ ios: { color: 'rgba(0,0,0,0.6)' } })}
    />
  );

  get contentInsetBottom() {
    /* fix for ios when keyboard shifts webview, but doesn't return it back when closing */
    return Platform.select({
      ios: this.isKeyboardOpen ? 0.01 : 0,
      android: 0
    });
  }

  get injectjs() {
    const userName = registerStore.userFullName || registerStore.user.reference;
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
    const data =
      `{\"client_name\": \"${
        userName
      }\", \"email\": \"${
        userEmail
      }\", \"phone\": \"${
        userPhone
      }\",\"description\": \"${
        userDescription
      }\"}`;

    return `setTimeout(() => { window.jivo_api.${method}(${data}); }, 1000);`;
  }

  keyboardDidShow = () => {
    this.isKeyboardOpen = true;
  };

  keyboardDidHide = () => {
    this.isKeyboardOpen = false;
  };

  handleAppStateChange = nextAppState => {
    if (nextAppState === 'active' && this.chatRef) {
      this.chatRef.current.reload();
    }
  };

  onScreenFocus = () => {
    clearTimeout(this.timerBlur);
    this.isFocused = true;
  };

  onScreenBlur = () => {
    this.timerBlur = setTimeout(() => { this.isFocused = false; }, this.delayBeforeBlur);
  };
}

export default translate('support')(ChatScreen);
