import React, { Component } from "react";
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { translate } from "react-i18next";
import { StyleSheet, View } from 'react-native';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import _ from 'lodash'


import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage, UFOTextInput } from '../../components/common'
import { screens, actionStyles, icons, colors, dims } from '../../utils/global'
import appStore from '../../stores/appStore';
import registerStore from '../../stores/registerStore';
import UFOCard from "../../components/UFOCard";


const PLACEHOLDER_COLOR = "rgba(255,255,255,0.2)";
const LIGHT_COLOR = "#FFF";


const REGEX_CODE_VALIDATION = /^([0-9]{3}-?[0-9]{3})$/

@observer
class PhoneScreen extends Component {

  @observable countryCode = DeviceInfo.getDeviceCountry().toLowerCase()
  @observable isCodeRequested = false
  @observable code = null
  @observable activityPending = false

  onPressFlag = () => {
    this.countryPicker.openModal()
  }

  selectCountry = (country) => {
    this.phoneInput.selectCountry(country.cca2.toLowerCase())
    this.countryCode = country.cca2
  }

  onChangePhoneNumber = (phoneNumber) => {
    registerStore.user.phone_number = phoneNumber
  }

  onChangeCode = (text) => {
    this.code = text
  }

  @action
  doCancel = async (isInWizzard) => {
    this.isCodeRequested = false;
    isInWizzard || !registerStore.isConnected ? this.props.navigation.navigate(screens.HOME.name) : this.props.navigation.popToTop()
  }

  @action
  doDisconnect = async (t, isInWizzard) => {
    this.activityPending = true
    this.isCodeRequested = false;
    await appStore.disconnect(t)
    this.activityPending = false
  }

  @action
  doConnect = async (isInWizzard) => {
    this.activityPending = true
    if (await appStore.connect(this.code)) {
      this.code = null
      if (isInWizzard && _.isEmpty(registerStore.user.email)) {
        this.props.navigation.navigate(screens.REGISTER_EMAIL.name, { 'isInWizzard': isInWizzard })
        this.activityPending = false
        return
      } else {
        this.props.navigation.pop()
        this.activityPending = false
        return
      }
    }
    this.activityPending = false
  }

  @action
  doRequestCode = async (isInWizzard) => {
    if (await registerStore.requestCode()) {
      this.isCodeRequested = true
    }
  }

  render() {

    const { t, i18n, navigation } = this.props;

    let isInWizzard = this.props.navigation.getParam('isInWizzard', false)

    let actions = []
    actions.push({
      style: actionStyles.ACTIVE,
      icon: isInWizzard || !registerStore.isConnected ? icons.CONTINUE_LATER : icons.CANCEL,
      onPress: async () => await this.doCancel(isInWizzard)
    })

    if (!registerStore.isConnected) {
      actions.push({
        style: !registerStore.isConnected ? this.isCodeRequested ? actionStyles.ACTIVE : this.phoneInput && this.phoneInput.isValidNumber() ? actionStyles.TODO : actionStyles.ACTIVE : actionStyles.DISABLE,
        icon: this.isCodeRequested ? icons.RESEND_CODE : icons.VALIDATE,
        onPress: async () => await this.doRequestCode(isInWizzard)
      })
    }

    if (!registerStore.isConnected && this.isCodeRequested) {
      actions.push({
        style: !registerStore.isConnected && this.code && REGEX_CODE_VALIDATION.test(this.code) ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.LOGIN,
        onPress: async () => await this.doConnect(isInWizzard)
      })
    }

    if (registerStore.isConnected) {
      actions.push({
        style: registerStore.isConnected ? actionStyles.ACTIVE : actionStyles.DISABLE,
        icon: icons.LOGOUT,
        onPress: async () => await this.doDisconnect(t, isInWizzard)
      })
    }


    return (
      <UFOContainer image={screens.REGISTER_PHONE.backgroundImage}>
        <UFOHeader transparent t={t} navigation={navigation} title={t('register:phoneTitle', { user: registerStore.user })} currentScreen={screens.REGISTER_PHONE} />
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          resetScrollToCoords={{ x: 0, y: 0 }}>
          <View style={{ paddingTop: dims.CONTENT_PADDING_TOP, paddingHorizontal: dims.CONTENT_PADDING_HORIZONTAL, flex: 0.80, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
            {!this.activityPending && registerStore.isConnected && (
              <UFOCard title={t('register:phoneNumberInputLabel')}>
                <UFOTextInput defaultValue={registerStore.user.phone_number} editable={false} />
              </UFOCard>
            )}
            {!this.activityPending && !registerStore.isConnected && this.isCodeRequested && (
              <UFOCard title={t('register:smsCodeInputLabel')}>
                <UFOTextInput autoFocus maxLength={107} keyboardAppearance='dark' keyboardType='number-pad' placeholder='000-000' onChangeText={this.onChangeCode} />
              </UFOCard>
            )}
            {!this.activityPending && !registerStore.isConnected && !this.isCodeRequested && (
              <UFOCard title={t('register:phoneNumberInputLabel')}>
                <PhoneInput
                  ref={(ref) => { this.phoneInput = ref; }}
                  onPressFlag={this.onPressFlag}
                  initialCountry={_.isEmpty(this.countryCode) ? "lu" : this.countryCode}
                  //style={{ height: 50 }}
                  textStyle={{
                    color: colors.TEXT.string(),
                    borderBottomWidth: 1,
                    borderColor: colors.ACTIVE.string(),
                  }}
                  defaultValue={registerStore.user.phone_number}
                  onChangePhoneNumber={this.onChangePhoneNumber}
                  offset={20}
                  autoFocus={true}
                />
                <CountryPicker
                  ref={(ref) => { this.countryPicker = ref; }}
                  filterPlaceholderTextColor={PLACEHOLDER_COLOR}
                  onChange={(value) => this.selectCountry(value)}
                  translation={i18n.language}
                  cca2={this.countryCode}
                  actionStyles={styles}
                >
                  <View></View>
                </CountryPicker>
              </UFOCard >
            )}

          </View>
        </KeyboardAwareScrollView>
        <UFOActionBar actions={actions} activityPending={this.activityPending} />
      </UFOContainer>
    );
  }
}



const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.TRANSITION_BACKGROUND.string()
  },
  contentContainer: {
    backgroundColor: colors.TRANSITION_BACKGROUND.string()
  },
  header: {
    backgroundColor: colors.TRANSITION_BACKGROUND.string()
  },
  itemCountryName: {
    borderBottomWidth: 0
  },
  countryName: {
    color: colors.HEADER_TEXT.string()
  },
  letterText: {
    color: colors.HEADER_TEXT.string()
  },
  input: {
    color: colors.HEADER_TEXT.string(),
    borderBottomWidth: 1,
    borderColor: colors.HEADER_TEXT.string()
  }
});

export default translate("translations")(PhoneScreen);
