import React, { Component } from "react";
import usersStore from '../../stores/usersStore';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import { translate } from "react-i18next";
import { StyleSheet, View, Text } from 'react-native';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info'
import TextInputMask from 'react-native-text-input-mask';
import ActionBarComponent from '../../components/actionBar'
import _ from 'lodash'

@observer
class PhoneScreen extends Component {

  static navigationOptions = ({ navigation, navigationOptions, screenProps }) => {
    return {
      title: navigation.getParam('title', 'Registration - Phone'),
    };
  };

  @observable countryCode = DeviceInfo.getDeviceCountry().toLowerCase()
  @observable isCodeRequested = false
  @observable code = null

  async componentDidMount() {
    this.props.navigation.setParams({ title: this.props.t('register:phoneTitle', { user: usersStore.user }) })
    this.phone.focus()
  }

  onPressFlag = () => {
    this.countryPicker.openModal()
  }

  selectCountry = (country) => {
    this.phone.selectCountry(country.cca2.toLowerCase())
    countryCode = country.cca2
  }

  onChangePhoneNumber = (phoneNumber) => {
    usersStore.user.phone_number = phoneNumber
  }

  render() {

    const { t, i18n } = this.props;
    let actions = [
      {
        style: 'done',
        icon: 'home',
        text: 'Home',
        onPress: () => this.props.navigation.navigate('Home')
      },
      {
        style: this.phone && this.phone.isValidNumber() ? 'todo' : 'disable',
        icon: 'account-key',
        text: 'Request code',
        onPress: () => {
          this.isCodeRequested = usersStore.requestCode()
        }
      },
      {
        style: this.code && this.code.length === 6 ? 'todo' : 'disable',
        icon: 'account-check',
        text: 'Validate code',
        onPress: () => usersStore.validateCode(this.code)
      },
    ]
    return (
      <View style={styles.container}>

        {!this.isCodeRequested && (
          <View style={styles.item}>
            <Text>{t('register:phoneNumberInputLabel')}</Text>
            <PhoneInput
              ref={(ref) => { this.phone = ref; }}
              onPressFlag={this.onPressFlag}
              initialCountry={_.isEmpty(this.countryCode) ? "lu" : this.countryCode}
              style={{ width: 200, borderBottomWidth: 1 }}
              value={usersStore.user.phone_number}
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
          </View>
        )}
        {this.isCodeRequested && (
          < View style={styles.item}>
            <Text>{t('register:smsCodeInputLabel')}</Text>
            <TextInputMask
              refInput={ref => { this.input = ref }}
              onChangeText={(formatted, extracted) => {
                this.code = extracted
              }}
              mask={"[000] - [000]"}
              placeholder=" 000 - 000 "
              style={{ width: 70 }}
            />

          </View>
        )
        }
        <ActionBarComponent actions={actions} />
      </View >
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 30,
    paddingBottom: 100
    //backgroundColor: "red"
  },
  item: {
    flex: 0.5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,

    //backgroundColor: "blue"
  }
});

export default translate("translations")(PhoneScreen);
