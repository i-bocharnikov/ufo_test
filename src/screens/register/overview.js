import React, { Component } from "react";
import { Content, Button, ListItem, Left, Body, Right, Card, CardItem, List, View } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import _ from 'lodash'

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOThumbnail, UFOImage } from '../../components/common'

import registerStore from '../../stores/registerStore';
import appStore from '../../stores/appStore';
import { screens, actionStyles, icons, colors, sizes } from '../../utils/global'
import UFOCard from "../../components/UFOCard";


@observer
class RegisterScreen extends Component {

  componentWillMount() {
    this.onLoad()
  }

  onLoad = async (payload) => {

    //console.log("=> LOAD SCREEN RegisterScreen:", payload)

    if (payload && payload.state && payload.state.routeName !== 'Overview') {
      return
    }

    if (!registerStore.isUserRegistered) {
      if (!registerStore.isConnected || _.isEmpty(registerStore.user.phone_number)) {
        this.props.navigation.navigate(screens.REGISTER_PHONE.name, { 'isInWizzard': true })
        return
      }
      if (_.isEmpty(registerStore.user.email)) {
        this.props.navigation.navigate(screens.REGISTER_EMAIL.name, { 'isInWizzard': true })
        return
      }
      if (_.isEmpty(registerStore.user.address)) {
        this.props.navigation.navigate(screens.REGISTER_ADDRESS.name, { 'isInWizzard': true })
        return
      }
      if (_.isEmpty(registerStore.user.identification_scan_front_side)) {
        this.props.navigation.navigate(screens.REGISTER_IDENTIFICATION.name, { 'isInWizzard': true })
        return
      }
      if (_.isEmpty(registerStore.user.driver_licence_scan_front_side)) {
        this.props.navigation.navigate(screens.REGISTER_DRIVER_LICENCE.name, { 'isInWizzard': true })
        return
      }
    }

    registerStore.user.identificationFrontDocument = "loading"
    if (registerStore.user.identification_scan_front_side) {
      registerStore.identificationFrontDocument = "data:image/png;base64," + (await registerStore.downloadDocument(registerStore.user.identification_scan_front_side.reference))
    } else {
      registerStore.identificationFrontDocument = null
    }
    registerStore.user.identificationBackDocument = "loading"
    if (registerStore.user.identification_scan_back_side) {
      registerStore.identificationBackDocument = "data:image/png;base64," + (await registerStore.downloadDocument(registerStore.user.identification_scan_back_side.reference))
    } else {
      registerStore.identificationBackDocument = null
    }
    registerStore.user.driverLicenceFrontDocument = "loading"
    if (registerStore.user.driver_licence_scan_front_side) {
      registerStore.driverLicenceFrontDocument = "data:image/png;base64," + (await registerStore.downloadDocument(registerStore.user.driver_licence_scan_front_side.reference))
    } else {
      registerStore.driverLicenceFrontDocument = null
    }
    registerStore.user.driverLicenceBackDocument = "loading"
    if (registerStore.user.driver_licence_scan_back_side) {
      registerStore.driverLicenceBackDocument = "data:image/png;base64," + (await registerStore.downloadDocument(registerStore.user.driver_licence_scan_back_side.reference))
    } else {
      registerStore.driverLicenceBackDocument = null
    }
  }

  disconnect = async (t, isInWizzard) => {
    await appStore.disconnect(t)
  }

  render() {

    const { t, navigation } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME.name)
      }
    ]

    if (registerStore.isConnected) {
      actions.push({
        style: actionStyles.ACTIVE,
        icon: icons.LOGOUT,
        onPress: async () => await this.disconnect(t)
      })

      actions.push({
        style: registerStore.isConnected ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.DONE,
        onPress: () => this.props.navigation.navigate(screens.HOME.name)
      })

    } else {
      actions.push({
        style: actionStyles.ACTIVE,
        icon: icons.LOGIN,
        onPress: async () => {
          this.props.navigation.navigate(screens.REGISTER_PHONE.name)
        }
      })
    }
    let phoneNumberColor = this.getColorForStatus(registerStore.user.phone_number_status)
    let emailColor = this.getColorForStatus(registerStore.user.email_status)
    let addressColor = this.getColorForStatus(registerStore.user.address_status)
    let identificationColor = this.getColorForStatus(registerStore.user.identification_status)
    let driverLicenceColor = this.getColorForStatus(registerStore.user.driver_licence_status)
    return (
      <UFOContainer image={require("../../assets/images/background/UFOBGREGISTER001.png")}>
        <NavigationEvents onWillFocus={payload => { this.onLoad(payload) }} />
        <UFOHeader t={t} navigation={navigation} title={t('register:overviewTitle', { user: registerStore.user })} currentScreen={screens.REGISTER_OVERVIEW} />
        <Content padder>
          <View style={{ flex: 1, justifyContent: 'space-around', alignContent: 'center' }} >
            <UFOCard text={registerStore.user.registration_message} />
            <Card >
              <List>

                <ListItem icon onPress={() => { this.props.navigation.navigate(screens.REGISTER_PHONE.name) }} >
                  <Left>
                    <Button style={{ backgroundColor: phoneNumberColor }}>
                      <UFOIcon icon={icons.PHONE} size={sizes.SMALL} />
                    </Button>
                  </Left>
                  <Body>
                    <UFOText>{t('register:phoneNumberLabel')}</UFOText>
                  </Body>
                  <Right>
                    <UFOText>{registerStore.user.phone_number}</UFOText>
                    <UFOIcon inverted style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} />
                  </Right>
                </ListItem>
                <ListItem icon onPress={() => { this.props.navigation.navigate(screens.REGISTER_EMAIL.name) }}>
                  <Left>
                    <Button style={{ backgroundColor: emailColor }}>
                      <UFOIcon icon={icons.EMAIL} size={sizes.SMALL} />
                    </Button>
                  </Left>
                  <Body>
                    <UFOText>{t('register:emailLabel')}</UFOText>
                  </Body>
                  <Right>
                    <UFOText>{_.truncate(registerStore.user.email, { 'length': 24 })}</UFOText>
                    <UFOIcon inverted style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} />
                  </Right>
                </ListItem>
                <ListItem icon onPress={() => { this.props.navigation.navigate(screens.REGISTER_ADDRESS.name) }}>
                  <Left>
                    <Button style={{ backgroundColor: addressColor }}>
                      <UFOIcon icon={icons.ADDRESS} size={sizes.SMALL} />
                    </Button>
                  </Left>
                  <Body>
                    <UFOText>{t('register:addressLabel')}</UFOText>
                  </Body>
                  <Right>
                    <UFOText >{_.truncate(registerStore.user.address, { 'length': 24 })}</UFOText>
                    <UFOIcon inverted style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} />
                  </Right>
                </ListItem>
                <ListItem icon onPress={() => this.props.navigation.navigate(screens.REGISTER_IDENTIFICATION.name, { frontImageUrl: registerStore.identificationFrontDocument, backImageUrl: registerStore.identificationBackDocument })}>
                  <Left>
                    <Button style={{ backgroundColor: identificationColor }}>
                      <UFOIcon icon={icons.IDENTIFICATION} size={sizes.SMALL} />
                    </Button>
                  </Left>
                  <Body>
                    <UFOText>{t('register:identificationLabel')}</UFOText>
                  </Body>
                  <Right >

                    <UFOImage source={{ uri: registerStore.identificationFrontDocument }} style={{ width: 40, height: 40 }} />
                    <UFOImage source={{ uri: registerStore.identificationBackDocument }} style={{ width: 40, height: 40 }} />
                    <UFOIcon inverted style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} />
                  </Right>
                </ListItem>
                <ListItem icon onPress={() => { this.props.navigation.navigate(screens.REGISTER_DRIVER_LICENCE.name, { frontImageUrl: registerStore.driverLicenceFrontDocument, backImageUrl: registerStore.driverLicenceBackDocument }) }}>
                  <Left>
                    <Button style={{ backgroundColor: driverLicenceColor }}>
                      <UFOIcon icon={icons.DRIVER_LICENCE} size={sizes.SMALL} />
                    </Button>
                  </Left>
                  <Body>
                    <UFOText>{t('register:driverLicenceLabel')}</UFOText>
                  </Body>
                  <Right >
                    <UFOImage source={{ uri: registerStore.driverLicenceFrontDocument }} style={{ width: 40, height: 40 }} />
                    <UFOImage source={{ uri: registerStore.driverLicenceBackDocument }} style={{ width: 40, height: 40 }} />
                    <UFOIcon inverted style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} />
                  </Right>
                </ListItem>
              </List>
            </Card>

          </View >

        </Content>
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }

  getColorForStatus = (status) => {
    if (registerStore.isStatusValidated(status)) {
      return colors.DONE
    }
    if (registerStore.isStatusNotValidated(status)) {
      return colors.PENDING
    }
    if (registerStore.isStatusMissing(status)) {
      return colors.TODO
    }
    return colors.WRONG
  }
}

export default translate("translations")(RegisterScreen);
