import React, { Component } from "react";
import usersStore from '../../stores/usersStore';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from "react-i18next";
import { StyleSheet, View, Dimensions } from 'react-native';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info'
import { Container, Content, Form, Item, Label, Input, Text } from 'native-base';
import _ from 'lodash'

import HeaderComponent from "../../components/header";
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import { screens, styles, icons, colors } from '../../utils/global'

const DARK_COLOR = colors.BACKGROUND.string();
const PLACEHOLDER_COLOR = "rgba(255,255,255,0.2)";
const LIGHT_COLOR = "#FFF";


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
    countryCode = country.cca2
  }

  onChangePhoneNumber = (phoneNumber) => {
    if (!usersStore.isStatusValidated(usersStore.user.phone_number_status)) {
      usersStore.user.phone_number = phoneNumber
    }
  }

  onChangeCode = (text) => {
    this.code = text
  }

  render() {

    const { t, i18n } = this.props;
    let user = usersStore.user
    let isUserConnected = !usersStore.isUserRegistrationMissing

    let actions = [
      {//TODO home versus back based on where user come from
        style: styles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      },
      {
        style: isUserConnected ? styles.ACTIVE : styles.DISABLE,
        icon: icons.DISCONNECT,
        onPress: async () => {
          this.isCodeRequested = false;
          await usersStore.disconnect()
        }
      }
    ]

    if (this.isCodeRequested) {
      actions.push({
        style: !isUserConnected && this.code && /^([0-9]{3}-?[0-9]{3})$/.test(this.code) ? styles.TODO : styles.DISABLE,
        icon: icons.CONNECT,
        onPress: async () => {
          if (await usersStore.connect(this.code)) {
            this.code = null
            this.props.navigation.navigate(screens.REGISTER_EMAIL)
          }
        }
      })
    } else {
      actions.push({
        style: !isUserConnected && this.phoneInput && this.phoneInput.isValidNumber() ? styles.TODO : styles.DISABLE,
        icon: icons.REQUEST_CODE,
        onPress: async () => {
          if (await usersStore.requestCode())
            this.isCodeRequested = true
        }
      })
    }
    let defaultPaddintTop = (Dimensions.get("window").height / 10)

    return (
      <Container>
        <HeaderComponent title={t('register:phoneTitle', { user: usersStore.user })} />
        <Content padder ref={(ref) => { this.content = ref; }}>
          <Form>
            {isUserConnected && (
              <Item stackedLabel>
                <Label style={{ paddingTop: defaultPaddintTop, paddingBottom: 25 }}>{t('register:phoneNumberInputLabel')}</Label>
                <Input defaultValue={user.phone_number} editable={false} />
              </Item>

            )}
            {!isUserConnected && !this.isCodeRequested && (
              <Item >
                <View style={{ justifyContent: 'space-evenly', alignContent: 'center' }}>
                  <Text style={{ paddingTop: defaultPaddintTop, paddingBottom: 25 }}>{t('register:phoneNumberInputLabel')}</Text>
                  <PhoneInput
                    ref={(ref) => { this.phoneInput = ref; }}
                    onPressFlag={this.onPressFlag}
                    initialCountry={_.isEmpty(this.countryCode) ? "lu" : this.countryCode}
                    style={{ height: 50 }}
                    textStyle={{ color: colors.TEXT.string() }}
                    value={user.phone_number}
                    onChangePhoneNumber={this.onChangePhoneNumber}
                    offset={20}
                    autoFocus
                  />

                  <CountryPicker
                    ref={(ref) => { this.countryPicker = ref; }}
                    filterPlaceholderTextColor={PLACEHOLDER_COLOR}
                    onChange={(value) => this.selectCountry(value)}
                    translation={i18n.language}
                    cca2={this.countryCode}
                    styles={darkTheme}
                  >
                    <View></View>
                  </CountryPicker>
                </View>
              </Item>
            )}

            {!isUserConnected && this.isCodeRequested && (
              <Item stackedLabel>
                <Label style={{ color: colors.TEXT.string(), paddingTop: defaultPaddintTop, paddingBottom: 25 }}>{t('register:smsCodeInputLabel')}</Label>
                <Input autoFocus maxLength={7} keyboardAppearance='dark' keyboardType='numeric' placeholder='000-000' ref={(ref) => { this.codeInput = ref; }} onChangeText={this.onChangeCode} />
              </Item>
            )}
          </Form>

        </Content>
        <ActionSupportComponent onPress={() => this.props.navigation.navigate(screens.SUPPORT, { context: screens.REGISTER_PHONE })} />
        <ActionBarComponent actions={actions} />
      </Container>
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
