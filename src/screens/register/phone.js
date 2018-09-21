import React, { Component } from "react";
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { translate } from "react-i18next";
import { StyleSheet, View, Dimensions } from 'react-native';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info'
import { Content, Form, Item, Label, Input } from 'native-base';
import _ from 'lodash'


import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage } from '../../components/common'
import { screens, actionStyles, icons, colors } from '../../utils/global'
import appStore from '../../stores/appStore';
import registerStore from '../../stores/registerStore';


const DARK_COLOR = colors.BACKGROUND.string();
const PLACEHOLDER_COLOR = "rgba(255,255,255,0.2)";
const LIGHT_COLOR = "#FFF";


const REGEX_CODE_VALIDATION = /^([0-9]{3}-?[0-9]{3})$/

@observer
class PhoneScreen extends Component {

  @observable countryCode = DeviceInfo.getDeviceCountry().toLowerCase()
  @observable isCodeRequested = false
  @observable code = null

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
    this.isCodeRequested = false;
    await appStore.disconnect(t)
  }

  @action
  doConnect = async (isInWizzard) => {
    if (await appStore.connect(this.code)) {
      this.code = null
      console.log("************after connect", isInWizzard, registerStore.user.email)
      if (isInWizzard && _.isEmpty(registerStore.user.email)) {
        this.props.navigation.navigate(screens.REGISTER_EMAIL.name, { 'isInWizzard': isInWizzard })
        return
      } else {
        this.props.navigation.pop()
        return
      }
    }
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

    if (!registerStore.isConnected && !this.isCodeRequested) {
      actions.push({
        style: !registerStore.isConnected && this.phoneInput && this.phoneInput.isValidNumber() ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.REQUEST_CODE,
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


    let defaultPaddintTop = (Dimensions.get("window").height / 10)

    return (
      <UFOContainer>
        <UFOHeader t={t} navigation={navigation} title={t('register:phoneTitle', { user: registerStore.user })} currentScreen={screens.REGISTER_PHONE} />
        <Content padder ref={(ref) => { this.content = ref; }}>
          <Form>
            {registerStore.isConnected && (
              <Item stackedLabel>
                <Label style={{ paddingTop: defaultPaddintTop, paddingBottom: 25, color: colors.TEXT.string() }}>{t('register:phoneNumberInputLabel')}</Label>
                <Input defaultValue={registerStore.user.phone_number} editable={false} />
              </Item>

            )}
            {!registerStore.isConnected && !this.isCodeRequested && (
              <Item >
                <View style={{ justifyContent: 'space-evenly', alignContent: 'center' }}>
                  <UFOText style={{ paddingTop: defaultPaddintTop, paddingBottom: 25 }}>{t('register:phoneNumberInputLabel')}</UFOText>
                  <PhoneInput
                    ref={(ref) => { this.phoneInput = ref; }}
                    onPressFlag={this.onPressFlag}
                    initialCountry={_.isEmpty(this.countryCode) ? "lu" : this.countryCode}
                    style={{ height: 50 }}
                    textStyle={{ color: colors.TEXT.string() }}
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
                    actionStyles={darkTheme}
                  >
                    <View></View>
                  </CountryPicker>
                </View>
              </Item>
            )}

            {!registerStore.isConnected && this.isCodeRequested && (
              <Item stackedLabel>
                <Label style={{ color: colors.TEXT.string(), paddingTop: defaultPaddintTop, paddingBottom: 25 }}>{t('register:smsCodeInputLabel')}</Label>
                <Input autoFocus maxLength={7} keyboardAppearance='dark' keyboardType='numeric' placeholder='000-000' ref={(ref) => { this.codeInput = ref; }} onChangeText={this.onChangeCode} />
              </Item>
            )}
          </Form>

        </Content>
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }
}



const darkTheme = StyleSheet.create({
  modalContainer: {
    backgroundColor: DARK_COLOR
  },
  contentContainer: {
    backgroundColor: DARK_COLOR
  },
  header: {
    backgroundColor: DARK_COLOR
  },
  itemCountryName: {
    borderBottomWidth: 0
  },
  countryName: {
    color: LIGHT_COLOR
  },
  letterText: {
    color: LIGHT_COLOR
  },
  input: {
    color: LIGHT_COLOR,
    borderBottomWidth: 1,
    borderColor: LIGHT_COLOR
  }
});

export default translate("translations")(PhoneScreen);
