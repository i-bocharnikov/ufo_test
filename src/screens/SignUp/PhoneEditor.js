import React, { Component, Fragment } from 'react';
import { View, BackHandler } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import {
  UFOContainer,
  UFOTextInput,
  ufoInputStyles
} from './../../components/common';
import { keys as screenKeys } from './../../navigators/helpers';
import { screens, actionStyles, icons } from './../../utils/global';
import { appStore, registerStore } from './../../stores';
import styles from './styles';

const REGEX_CODE_VALIDATION = /^([0-9]{3}-?[0-9]{3})$/;

@observer
class PhoneScreen extends Component {
  @observable countryCode = DeviceInfo.getDeviceCountry().toLowerCase();
  @observable activityPending = false;
  @observable isCodeRequested = false;
  @observable code = null;
  backHandler = null;

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.doCancel);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  render() {
    const { t, i18n, navigation } = this.props;

    return (
      <UFOContainer image={screens.REGISTER_OVERVIEW.backgroundImage}>
        <UFOHeader
          t={t}
          navigation={navigation}
          title={t('register:phoneTitle', { user: registerStore.user })}
          currentScreen={screens.REGISTER_PHONE}
        />
        <View style={styles.bodyWrapper}>
        {!this.activityPending && registerStore.isConnected && (
          <PhoneInput
            disabled={true}
            value={registerStore.user.phone_number}
            style={{
              ...ufoInputStyles,
              paddingHorizontal: 20
            }}
          />
        )}
        {!this.activityPending && !registerStore.isConnected && this.isCodeRequested && (
          <UFOTextInput
            autoFocus={true}
            maxLength={10}
            keyboardType="number-pad"
            placeholder="000-000"
            onChangeText={this.onChangeCode}
          />
        )}
        {!this.activityPending && !registerStore.isConnected && !this.isCodeRequested && (
          <Fragment>
            <PhoneInput
              ref={ref => (this.phoneInput = ref)}
              value={registerStore.user.phone_number}
              onChangePhoneNumber={this.onChangePhoneNumber}
              textProps={{ autoFocus: true }}
              style={{
                ...ufoInputStyles,
                paddingHorizontal: 20
              }}
              onPressFlag={this.onPressFlag}
              initialCountry={_.isEmpty(this.countryCode) ? 'lu' : this.countryCode}
            />
            <CountryPicker
              ref={ref => (this.countryPicker = ref)}
              onChange={value => this.selectCountry(value)}
              translation={i18n.language}
              cca2={this.countryCode}
            >
              <View />
            </CountryPicker>
          </Fragment>
        )}
        </View>
        <UFOActionBar actions={this.compileActions} />
      </UFOContainer>
    );
  }

  get compileActions() {
    const actions = [];

    /* cancel btn */
    actions.push({
      style: actionStyles.ACTIVE,
      icon: !registerStore.isConnected ? icons.CONTINUE_LATER : icons.CANCEL,
      onPress: this.doCancel
    });

    /* code request or resend btn */
    if (!registerStore.isConnected) {
      actions.push({
        style: this.isCodeRequested
          ? actionStyles.ACTIVE
          : registerStore.isCurrentPhoneValid
            ? actionStyles.TODO
            : actionStyles.DISABLE,
        icon: this.isCodeRequested ? icons.RESEND_CODE : icons.VALIDATE,
        onPress: this.doRequestCode
      });
    }

    /* connect btn */
    if (!registerStore.isConnected && this.isCodeRequested) {
      actions.push({
        style: !registerStore.isConnected && this.code && REGEX_CODE_VALIDATION.test(this.code)
          ? actionStyles.TODO
          : actionStyles.DISABLE,
        icon: icons.LOGIN,
        onPress: this.doConnect
      });
    }

    /* disconnect btn */
    if (registerStore.isConnected) {
      actions.push({
        style: actionStyles.ACTIVE,
        icon: icons.LOGOUT,
        onPress: this.doDisconnect
      });
    }

    return actions;
  }

  doCancel = () => {
    if (!this.props.navigation.isFocused()) {
      /* to prevent hardwareBackPress event with tab navigation */
      return false;
    }

    this.isCodeRequested = false;
    registerStore.isConnected
      ? this.props.navigation.popToTop()
      : this.props.navigation.navigate(screenKeys.Home);

    /* to handle manual hardwareBackPress event on android */
    return true;
  };

  doDisconnect = async () => {
    this.activityPending = true;
    this.isCodeRequested = false;
    await appStore.disconnect(this.props.t);
    this.activityPending = false;
  };

  doConnect = async () => {
    this.activityPending = true;
    const isConnected = await appStore.connect(this.code);
    this.activityPending = false;

    if (isConnected) {
      this.code = null;
      _.isEmpty(registerStore.user.email)
        ? this.props.navigation.navigate(screenKeys.Email, { initRegistration: true })
        : this.props.navigation.pop();
    }
  };

  doRequestCode = async () => {
    if (await registerStore.requestCode()) {
      this.isCodeRequested = true;
    }
  };

  onPressFlag = () => {
    this.countryPicker.openModal();
  };

  selectCountry = country => {
    registerStore.user.phone_number = null;
    this.phoneInput.selectCountry(country.cca2.toLowerCase());
    this.phoneInput.focus();
    this.countryCode = country.cca2;
  };

  onChangePhoneNumber = phoneNumber => {
    registerStore.user.phone_number = phoneNumber;
  };

  onChangeCode = text => {
    this.code = text;
  };
}

export default translate()(PhoneScreen);
