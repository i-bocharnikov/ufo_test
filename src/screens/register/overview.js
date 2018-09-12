import React, { Component } from "react";
import { Container, Content, Button, Text, ListItem, Left, Body, Right, Card, CardItem, List } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import _ from 'lodash'

import Thumbnail from '../../components/thumbnail'
import HeaderComponent from "../../components/header";
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import registerStore from '../../stores/registerStore';
import { screens, actionStyles, icons, colors, sizes } from '../../utils/global'
import Icon from '../../components/Icon'

@observer
class RegisterScreen extends Component {

  componentWillMount() {
    this.onLoad()
  }

  onLoad = async (payload) => {
    console.log("=> LOAD SCREEN RegisterScreen:", payload)

    if (payload && payload.state && payload.state.routeName !== 'Overview') {
      return
    }

    if (!registerStore.isUserRegistered) {
      if (!registerStore.isConnected || _.isEmpty(registerStore.user.phone_number)) {
        this.props.navigation.navigate(screens.REGISTER_PHONE, { 'isInWizzard': true })
        return
      }
      if (_.isEmpty(registerStore.user.email)) {
        this.props.navigation.navigate(screens.REGISTER_EMAIL, { 'isInWizzard': true })
        return
      }
      if (_.isEmpty(registerStore.user.address)) {
        this.props.navigation.navigate(screens.REGISTER_ADDRESS, { 'isInWizzard': true })
        return
      }
      if (_.isEmpty(registerStore.user.identification_scan_front_side)) {
        this.props.navigation.navigate(screens.REGISTER_IDENTIFICATION, { 'isInWizzard': true })
        return
      }
      if (_.isEmpty(registerStore.user.driver_licence_scan_front_side)) {
        this.props.navigation.navigate(screens.REGISTER_DRIVER_LICENCE, { 'isInWizzard': true })
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

  render() {

    const { t } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME)
      }
    ]

    if (registerStore.isConnected) {
      actions.push({
        style: actionStyles.ACTIVE,
        icon: icons.DISCONNECT,
        onPress: async () => {
          this.isCodeRequested = false;
          await registerStore.disconnect()
        }
      }
      )
    } else {
      actions.push({
        style: actionStyles.ACTIVE,
        icon: icons.CONNECT,
        onPress: async () => {
          this.props.navigation.navigate(screens.REGISTER_PHONE)
        }
      })
    }
    let phoneNumberColor = this.getColorForStatus(registerStore.user.phone_number_status)
    let emailColor = this.getColorForStatus(registerStore.user.email_status)
    let addressColor = this.getColorForStatus(registerStore.user.address_status)
    let identificationColor = this.getColorForStatus(registerStore.user.identification_status)
    let driverLicenceColor = this.getColorForStatus(registerStore.user.driver_licence_status)
    return (
      <Container>
        <NavigationEvents onWillFocus={payload => { this.onLoad(payload) }} />
        <HeaderComponent t={t} title={t('register:overviewTitle', { user: registerStore.user })} />
        <Content padder>
          <List>
            <ListItem>
              <Body>
                <Card >
                  <CardItem>
                    <Body>
                      <Text>
                        {registerStore.user.registration_message}
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              </Body>
            </ListItem>
            <ListItem icon onPress={() => { this.props.navigation.navigate(screens.REGISTER_PHONE) }}>
              <Left>
                <Button style={{ backgroundColor: phoneNumberColor }}>
                  <Icon icon={icons.PHONE} size={sizes.SMALL} color={colors.TEXT} />
                </Button>
              </Left>
              <Body>
                <Text>{t('register:phoneNumberLabel')}</Text>
              </Body>
              <Right>
                <Text>{registerStore.user.phone_number}</Text>
                <Icon style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} color={colors.TEXT} />
              </Right>
            </ListItem>
            <ListItem icon onPress={() => { this.props.navigation.navigate(screens.REGISTER_EMAIL) }}>
              <Left>
                <Button style={{ backgroundColor: emailColor }}>
                  <Icon icon={icons.EMAIL} size={sizes.SMALL} color={colors.TEXT} />
                </Button>
              </Left>
              <Body>
                <Text>{t('register:emailLabel')}</Text>
              </Body>
              <Right>
                <Text>{_.truncate(registerStore.user.email, { 'length': 24 })}</Text>
                <Icon style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} color={colors.TEXT} />
              </Right>
            </ListItem>
            <ListItem icon onPress={() => { this.props.navigation.navigate(screens.REGISTER_ADDRESS) }}>
              <Left>
                <Button style={{ backgroundColor: addressColor }}>
                  <Icon icon={icons.ADDRESS} size={sizes.SMALL} color={colors.TEXT} />
                </Button>
              </Left>
              <Body>
                <Text>{t('register:addressLabel')}</Text>
              </Body>
              <Right>
                <Text >{_.truncate(registerStore.user.address, { 'length': 24 })}</Text>
                <Icon style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} color={colors.TEXT} />
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.props.navigation.navigate(screens.REGISTER_IDENTIFICATION, { frontImageUrl: registerStore.identificationFrontDocument, backImageUrl: registerStore.identificationBackDocument })}>
              <Left>
                <Button style={{ backgroundColor: identificationColor }}>
                  <Icon icon={icons.IDENTIFICATION} size={sizes.SMALL} color={colors.TEXT} />
                </Button>
              </Left>
              <Body>
                <Text>{t('register:identificationLabel')}</Text>
              </Body>
              <Right >

                <Thumbnail source={registerStore.identificationFrontDocument} />
                <Thumbnail source={registerStore.identificationBackDocument} />
                <Icon style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} color={colors.TEXT} />
              </Right>
            </ListItem>
            <ListItem icon onPress={() => { this.props.navigation.navigate(screens.REGISTER_DRIVER_LICENCE, { frontImageUrl: registerStore.driverLicenceFrontDocument, backImageUrl: registerStore.driverLicenceBackDocument }) }}>
              <Left>
                <Button style={{ backgroundColor: driverLicenceColor }}>
                  <Icon icon={icons.DRIVER_LICENCE} size={sizes.SMALL} color={colors.TEXT} />
                </Button>
              </Left>
              <Body>
                <Text>{t('register:driverLicenceLabel')}</Text>
              </Body>
              <Right >
                <Thumbnail source={registerStore.driverLicenceFrontDocument} />
                <Thumbnail source={registerStore.driverLicenceBackDocument} />
                <Icon style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} color={colors.TEXT} />
              </Right>
            </ListItem>
          </List>
        </Content>
        <ActionSupportComponent onPress={() => { this.props.navigation.navigate(screens.SUPPORT, { context: screens.REGISTER_OVERVIEW }) }} />
        <ActionBarComponent actions={actions} />
      </Container>
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
