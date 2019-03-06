import React, { Component, Fragment } from 'react';
import { View, BackHandler, ScrollView, Text } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';

import { UFOHeader } from './../../components/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import {
  UFOContainer,
  UFOTextInputBold,
  ufoInputBoldStyles
} from './../../components/common';
import screenKeys from './../../navigators/helpers/screenKeys';
import { appStore, registerStore } from './../../stores';
import styles from './styles';
// deprecated, using in old UFOActionBar
import { actionStyles, icons } from './../../utils/global';

const REGEX_CODE_VALIDATION = /^([0-9]{3}-?[0-9]{3})$/;
const REGEX_EMAIL_VALIDATION = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@observer
class ContactsInfoEditorScreen extends Component {
  phoneInputRef = React.createRef();
  countryPickerRef = React.createRef();

  @observable initRegistration = !registerStore.isConnected;
  @observable countryCode = DeviceInfo.getDeviceCountry().toLowerCase();
  @observable smsCodeRequested = false;
  @observable smsCode = null;
  @observable emailValue = registerStore.user.email;
  @observable activityPending = false;

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.doCancel);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.doCancel);
  }

  render() {
    return (
      <UFOContainer style={styles.container}>
        <UFOHeader
          title={this.props.t('contactsHeader', { context: this.headerContext })}
          leftBtnIcon="keyboard-backspace"
          leftBtnAction={this.doCancel}
          rightBtnUseDefault={true}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {registerStore.isConnected && this.renderContactsEditBlock()}
          {!registerStore.isConnected && !this.smsCodeRequested && this.renderPhoneConnectBlock()}
          {!registerStore.isConnected && this.smsCodeRequested && this.renderCodeConnectBlock()}
        </ScrollView>
        <UFOActionBar
          actions={this.compileActions}
          activityPending={this.activityPending}
        />
      </UFOContainer>
    );
  }

  renderPhoneConnectBlock = () => {
    const { i18n, t } = this.props;

    return (
      <UFOTextInputBold
        title={t('phoneLabel')}
        containerStyle={styles.blockShadow}
        InputComponent={
          <Fragment>
            <PhoneInput
              ref={this.phoneInputRef}
              value={registerStore.user.phone_number}
              onChangePhoneNumber={this.onChangePhoneNumber}
              textProps={{ autoFocus: true }}
              textStyle={{ ...ufoInputBoldStyles }}
              onPressFlag={() => this.countryPickerRef.current.openModal()}
              initialCountry={_.isEmpty(this.countryCode) ? 'lu' : this.countryCode}
            />
            <CountryPicker
              ref={this.countryPickerRef}
              onChange={this.selectCountry}
              translation={i18n.language}
              cca2={this.countryCode}
            >
              <View />
            </CountryPicker>
          </Fragment>
        }
      />
    );
  };

  renderCodeConnectBlock = () => {
    const { t } = this.props;

    return (
      <Fragment>
        <UFOTextInputBold
          title={t('smsCodeLabel')}
          containerStyle={styles.blockShadow}
          autoFocus={true}
          maxLength={10}
          keyboardType="number-pad"
          onChangeText={this.onChangeCode}
        />
        <Text style={styles.smsCodeNote}>
          {t('smsWaitingNote')}
        </Text>
      </Fragment>
    );
  };

  renderContactsEditBlock = () => {
    const { t } = this.props;

    return (
      <Fragment>
        <UFOTextInputBold
          title={t('phoneLabel')}
          containerStyle={styles.blockShadow}
          InputComponent={
            <PhoneInput
              disabled={true}
              value={registerStore.user.phone_number}
              textStyle={{ ...ufoInputBoldStyles }}
            />
          }
        />
        <UFOTextInputBold
          title={t('emailLabel')}
          containerStyle={[ styles.nextInputIndent, styles.blockShadow ]}
          autoFocus={true}
          keyboardType="email-address"
          defaultValue={registerStore.user.email}
          onChangeText={this.onChangeEmail}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          textContentType="emailAddress"
          enablesReturnKeyAutomatically={true}
        />
      </Fragment>
    );
  };

  get headerContext() {
    if (registerStore.isConnected) {
      return null;
    }

    return this.smsCodeRequested ? 'code' : 'phone';
  }

  get compileActions() {
    const actions = [{
      style: actionStyles.ACTIVE,
      icon: registerStore.isConnected ? icons.CANCEL : icons.CONTINUE_LATER,
      onPress: this.doCancel
    }];

    /* smsCode request or resend btn */
    if (!registerStore.isConnected) {
      actions.push({
        style: this.smsCodeRequested
          ? actionStyles.ACTIVE
          : registerStore.isCurrentPhoneValid
            ? actionStyles.TODO
            : actionStyles.DISABLE,
        icon: this.smsCodeRequested ? icons.RESEND_CODE : icons.VALIDATE,
        onPress: this.doRequestCode
      });
    }

    /* connect btn */
    if (!registerStore.isConnected && this.smsCodeRequested) {
      actions.push({
        style: !registerStore.isConnected && this.smsCode && REGEX_CODE_VALIDATION.test(this.smsCode)
          ? actionStyles.TODO
          : actionStyles.DISABLE,
        icon: icons.LOGIN,
        onPress: this.doConnect
      });
    }

    /* disconnect btn and email save btn */
    if (registerStore.isConnected) {
      actions.push({
        style: actionStyles.ACTIVE,
        icon: icons.LOGOUT,
        onPress: this.doDisconnect
      });

      actions.push({
        style: this.emailValue
          && REGEX_EMAIL_VALIDATION.test(this.emailValue)
          && this.emailValue !== registerStore.user.email
            ? actionStyles.TODO
            : actionStyles.DISABLE,
        icon: this.initRegistration ? icons.NEXT : icons.SAVE,
        onPress: this.doSave
      });
    }

    return actions;
  }

  /*
   * Cancel editing/registration and go back
  */
  doCancel = () => {
    this.smsCodeRequested = false;
    registerStore.isConnected
      ? this.props.navigation.popToTop()
      : this.props.navigation.navigate(screenKeys.Home);

    // for prevent hardwareBackPress event on android
    return true;
  };

  /*
   * Validate phone with code and log in
  */
  doConnect = async () => {
    this.activityPending = true;
    const isConnected = await appStore.connect(this.smsCode);
    this.activityPending = false;

    if (isConnected) {
      this.smsCode = null;
      this.emailValue = registerStore.user.email;
      this.initRegistration = !!registerStore.user.email
    }
  };

  /*
   * Log out
  */
  doDisconnect = async () => {
    this.activityPending = true;
    this.smsCodeRequested = false;
    await appStore.disconnect();
    this.activityPending = false;
  };

  /*
   * Request code for phone validation
  */
  doRequestCode = async () => {
    this.smsCodeRequested = await registerStore.requestSmsCode();
  };

  /*
   * Save new value for user email
  */
  doSave = async () => {
    registerStore.user.email = this.emailValue;
    const isSaved = await registerStore.save();

    if (isSaved) {
      this.initRegistration
        ? this.props.navigation.replace(screenKeys.BillingInfoEditor, { initRegistration: true })
        : this.props.navigation.pop();
    }
  };

  /*
   * Select country from picker
  */
  selectCountry = country => {
    registerStore.user.phone_number = null;
    this.phoneInputRef.current.selectCountry(country.cca2.toLowerCase());
    this.phoneInputRef.current.focus();
    this.countryCode = country.cca2;
  };

  /*
   * Change phone input
  */
  onChangePhoneNumber = phoneNumber => {
    registerStore.user.phone_number = phoneNumber;
  };

  /*
   * Change sms code input
  */
  onChangeCode = text => {
    this.smsCode = text;
  };

  /*
   * Change email input
  */
  onChangeEmail = value => {
    this.emailValue = value;
  };
}

export default translate('register')(ContactsInfoEditorScreen);
