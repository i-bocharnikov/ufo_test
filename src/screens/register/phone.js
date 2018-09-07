import React, { Component } from "react";
import usersStore from '../../stores/usersStore';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from "react-i18next";
import { StyleSheet, View, Text } from 'react-native';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info'
import TextInputMask from 'react-native-text-input-mask';
import { Container, Content, Form, Item, Label, Input } from 'native-base';
import _ from 'lodash'

import HeaderComponent from "../../components/header";
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import { screens, styles, icons } from '../../utils/global'

@observer
class PhoneScreen extends Component {

  @observable countryCode = DeviceInfo.getDeviceCountry().toLowerCase()
  @observable isCodeRequested = false
  @observable code = null

  onPressFlag = () => {
    this.countryPicker.openModal()
  }

  selectCountry = (country) => {
    this.phone.selectCountry(country.cca2.toLowerCase())
    countryCode = country.cca2
  }

  onChangePhoneNumber = (phoneNumber) => {
    if (!usersStore.isStatusValidated(usersStore.user.phone_number_status)) {
      usersStore.user.phone_number = phoneNumber
    }
  }

  render() {

    const { t, i18n } = this.props;
    let user = usersStore.user
    let isUserConnected = !usersStore.isStatusMissing

    let actions = [
      {//TODO home versus back based on where user come from
        style: styles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      },
      {
        style: isUserConnected ? styles.ACTIVE : styles.DISABLE,
        icon: icons.DISCONNECT,
        onPress: () => { this.isCodeRequested = usersStore.disconnect() }
      }
    ]

    if (this.isCodeRequested) {
      actions.push({
        style: !isUserConnected && this.code && this.code.length === 6 ? styles.TODO : styles.DISABLE,
        icon: icons.CONNECT,
        onPress: async () => {
          if (await usersStore.connect(this.code)) {
            this.props.navigation.navigate(screens.REGISTER_EMAIL)
          }
          this.code = null
        }
      })
    } else {
      actions.push({
        style: !isUserConnected && this.phone && this.phone.isValidNumber() ? styles.TODO : styles.DISABLE,
        icon: icons.REQUEST_CODE,
        onPress: async () => {
          this.isCodeRequested = await usersStore.requestCode()
        }
      })
    }

    return (


      <Container>
        <HeaderComponent title={t('register:phoneTitle', { user: usersStore.user })} />
        <Content padder>
          <Form>
            {isUserConnected && (
              <Item >
                <Label>{t('register:phoneNumberInputLabel')}[{user.phone_number}]</Label>
                <Input defaultValue={user.phone_number} editable={false} />

              </Item>
            )}
            {!isUserConnected && !this.isCodeRequested && (
              <Item floatingLabel>
                <Label>{t('register:phoneNumberInputLabel')}</Label>
                <PhoneInput
                  ref={(ref) => { this.phone = ref; }}
                  onPressFlag={this.onPressFlag}
                  initialCountry={_.isEmpty(this.countryCode) ? "lu" : this.countryCode}
                  style={{ width: 200, borderBottomWidth: 1 }}
                  value={user.phone_number}
                  onChangePhoneNumber={this.onChangePhoneNumber}
                  offset={20}
                />

                <CountryPicker
                  ref={(ref) => { this.countryPicker = ref; }}
                  onChange={(value) => this.selectCountry(value)}
                  translation={i18n.language}
                  cca2={this.countryCode}
                >
                  <View></View>
                </CountryPicker>
              </Item>
            )}

            {!isUserConnected && this.isCodeRequested && (
              <Item floatingLabel>
                <Label>{t('register:smsCodeInputLabel')}</Label>
                <TextInputMask
                  refInput={ref => { this.input = ref }}
                  onChangeText={(formatted, extracted) => {
                    this.code = extracted
                  }}
                  mask={"[000] - [000]"}
                  placeholder=" 000 - 000 "
                  style={{ width: 70 }}
                />
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

export default translate("translations")(PhoneScreen);
