import React, { Component, Fragment } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { translate } from 'react-i18next';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import {
  UFOContainer_re,
  UFOTextInput_re,
  ufoInputStyles
} from '../../components/common';
import { screens, actionStyles, icons } from './../../utils/global';
import appStore from '../../stores/appStore';
import registerStore from '../../stores/registerStore';
import styles from './styles';

const REGEX_CODE_VALIDATION = /^([0-9]{3}-?[0-9]{3})$/;

@observer
class PhoneScreen extends Component {

  @observable countryCode = DeviceInfo.getDeviceCountry().toLowerCase();
  @observable isCodeRequested = false;
  @observable code = null;
  @observable activityPending = false;

  render() {
    const { t, i18n, navigation } = this.props;

    return (
      <UFOContainer_re image={screens.REGISTER_OVERVIEW.backgroundImage}>
        <UFOHeader
          t={t}
          navigation={navigation}
          title={t('register:phoneTitle', {user: registerStore.user})}
          currentScreen={screens.REGISTER_PHONE}
        />
        <View style={styles.bodyWrapper}>
        {!this.activityPending && registerStore.isConnected && (
          <UFOTextInput_re
            defaultValue={registerStore.user.phone_number}
            editable={false}
          />
        )}
        {!this.activityPending && !registerStore.isConnected && this.isCodeRequested && (
          <UFOTextInput_re
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
              onPressFlag={this.onPressFlag}
              initialCountry={_.isEmpty(this.countryCode) ? 'lu' : this.countryCode}
              style={{
                ...ufoInputStyles,
                paddingHorizontal: 20
              }}
              defaultValue={registerStore.user.phone_number}
              onChangePhoneNumber={this.onChangePhoneNumber}
              autoFocus={true}
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
        <UFOActionBar actions={this.compileActions()} />
      </UFOContainer_re>
    );
  }

  @action
  doCancel = async isInWizzard => {
    this.isCodeRequested = false;
    isInWizzard || !registerStore.isConnected
      ? this.props.navigation.navigate(screens.HOME.name)
      : this.props.navigation.popToTop();
  };

  @action
  doDisconnect = async (t, isInWizzard) => {
    this.activityPending = true;
    this.isCodeRequested = false;
    await appStore.disconnect(t);
    this.activityPending = false;
  };

  @action
  doConnect = async isInWizzard => {
    this.activityPending = true;

    if (await appStore.connect(this.code)) {
      this.code = null;
      if (isInWizzard && _.isEmpty(registerStore.user.email)) {
        this.props.navigation.navigate(screens.REGISTER_EMAIL.name, {'isInWizzard': isInWizzard});
        this.activityPending = false;
        return;
      } else {
        this.props.navigation.pop();
        this.activityPending = false;
        return;
      }
    }

    this.activityPending = false;
  };

  @action
  doRequestCode = async isInWizzard => {
    if (await registerStore.requestCode()) {
      this.isCodeRequested = true;
    }
  };

  compileActions = () => {
    const isInWizzard = this.props.navigation.getParam('isInWizzard', false);

    const actions = [];
    actions.push({
      style: actionStyles.ACTIVE,
      icon: isInWizzard || !registerStore.isConnected ? icons.CONTINUE_LATER : icons.CANCEL,
      onPress: async () => await this.doCancel(isInWizzard)
    });

    if (!registerStore.isConnected) {
      actions.push({
        style: !registerStore.isConnected 
          ? this.isCodeRequested
            ? actionStyles.ACTIVE 
            : this.phoneInput && this.phoneInput.isValidNumber()
              ? actionStyles.TODO
              : actionStyles.ACTIVE
          : actionStyles.DISABLE,
        icon: this.isCodeRequested ? icons.RESEND_CODE : icons.VALIDATE,
        onPress: async () => await this.doRequestCode(isInWizzard)
      });
    }

    if (!registerStore.isConnected && this.isCodeRequested) {
      actions.push({
        style: !registerStore.isConnected && this.code && REGEX_CODE_VALIDATION.test(this.code)
          ? actionStyles.TODO
          : actionStyles.DISABLE,
        icon: icons.LOGIN,
        onPress: async () => await this.doConnect(isInWizzard)
      })
    }

    if (registerStore.isConnected) {
      actions.push({
        style: registerStore.isConnected ? actionStyles.ACTIVE : actionStyles.DISABLE,
        icon: icons.LOGOUT,
        onPress: async () => await this.doDisconnect(t, isInWizzard)
      });
    }

    return actions;
  }

  onPressFlag = () => {
    this.countryPicker.openModal()
  };

  selectCountry = country => {
    this.phoneInput.selectCountry(country.cca2.toLowerCase());
    this.countryCode = country.cca2;
  };

  onChangePhoneNumber = phoneNumber => {
    registerStore.user.phone_number = phoneNumber;
  };

  onChangeCode = text => {
    this.code = text;
  };
}

export default translate('translations')(PhoneScreen);
