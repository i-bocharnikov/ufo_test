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
import usersStore from '../../stores/usersStore';
import { screens, styles, icons, colors, sizes } from '../../utils/global'
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


    if (_.isEmpty(usersStore.user.phone_number)) {
      this.props.navigation.navigate(screens.REGISTER_PHONE)
      return
    }

    usersStore.user.identificationFrontDocument = "loading"
    if (usersStore.user.identification_scan_front_side) {
      usersStore.identificationFrontDocument = "data:image/png;base64," + (await usersStore.downloadDocument(usersStore.user.identification_scan_front_side.reference))
    } else {
      usersStore.identificationFrontDocument = null
    }
    usersStore.user.identificationBackDocument = "loading"
    if (usersStore.user.identification_scan_back_side) {
      usersStore.identificationBackDocument = "data:image/png;base64," + (await usersStore.downloadDocument(usersStore.user.identification_scan_back_side.reference))
    } else {
      usersStore.identificationBackDocument = null
    }
    usersStore.user.driverLicenceFrontDocument = "loading"
    if (usersStore.user.driver_licence_scan_front_side) {
      usersStore.driverLicenceFrontDocument = "data:image/png;base64," + (await usersStore.downloadDocument(usersStore.user.driver_licence_scan_front_side.reference))
    } else {
      usersStore.driverLicenceFrontDocument = null
    }
    usersStore.user.driverLicenceBackDocument = "loading"
    if (usersStore.user.driver_licence_scan_back_side) {
      usersStore.driverLicenceBackDocument = "data:image/png;base64," + (await usersStore.downloadDocument(usersStore.user.driver_licence_scan_back_side.reference))
    } else {
      usersStore.driverLicenceBackDocument = null
    }

  }

  render() {

    const { t } = this.props;
    let actions = [
      {
        style: styles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME)
      }
    ]

    if (usersStore.isConnected) {
      actions.push({
        style: styles.ACTIVE,
        icon: icons.DISCONNECT,
        onPress: async () => {
          this.isCodeRequested = false;
          await usersStore.disconnect()
        }
      }
      )
    } else {
      actions.push({
        style: styles.ACTIVE,
        icon: icons.CONNECT,
        onPress: async () => {
          this.props.navigation.navigate(screens.REGISTER_PHONE)
        }
      })
    }
    let phoneNumberColor = this.getColorForStatus(usersStore.user.phone_number_status)
    let emailColor = this.getColorForStatus(usersStore.user.email_status)
    let addressColor = this.getColorForStatus(usersStore.user.address_status)
    let identificationColor = this.getColorForStatus(usersStore.user.identification_status)
    let driverLicenceColor = this.getColorForStatus(usersStore.user.driver_licence_status)
    return (
      <Container>
        <NavigationEvents onWillFocus={payload => { this.onLoad(payload) }} />
        <HeaderComponent t={t} title={t('register:overviewTitle', { user: usersStore.user })} />
        <Content padder>
          <List>
            <ListItem>
              <Body>
                <Card >
                  <CardItem>
                    <Body>
                      <Text>
                        {usersStore.user.registration_message}
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
                <Text>{usersStore.user.phone_number}</Text>
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
                <Text>{_.truncate(usersStore.user.email, { 'length': 24 })}</Text>
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
                <Text >{_.truncate(usersStore.user.address, { 'length': 24 })}</Text>
                <Icon style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} color={colors.TEXT} />
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.props.navigation.navigate(screens.REGISTER_IDENTIFICATION, { frontImageUrl: usersStore.identificationFrontDocument, backImageUrl: usersStore.identificationBackDocument })}>
              <Left>
                <Button style={{ backgroundColor: identificationColor }}>
                  <Icon icon={icons.IDENTIFICATION} size={sizes.SMALL} color={colors.TEXT} />
                </Button>
              </Left>
              <Body>
                <Text>{t('register:identificationLabel')}</Text>
              </Body>
              <Right >

                <Thumbnail source={usersStore.identificationFrontDocument} />
                <Thumbnail source={usersStore.identificationBackDocument} />
                <Icon style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} color={colors.TEXT} />
              </Right>
            </ListItem>
            <ListItem icon onPress={() => { this.props.navigation.navigate(screens.REGISTER_DRIVER_LICENCE, { frontImageUrl: usersStore.driverLicenceFrontDocument, backImageUrl: usersStore.driverLicenceBackDocument }) }}>
              <Left>
                <Button style={{ backgroundColor: driverLicenceColor }}>
                  <Icon icon={icons.DRIVER_LICENCE} size={sizes.SMALL} color={colors.TEXT} />
                </Button>
              </Left>
              <Body>
                <Text>{t('register:driverLicenceLabel')}</Text>
              </Body>
              <Right >
                <Thumbnail source={usersStore.driverLicenceFrontDocument} />
                <Thumbnail source={usersStore.driverLicenceBackDocument} />
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
    if (usersStore.isStatusValidated(status)) {
      return colors.DONE
    }
    if (usersStore.isStatusNotValidated(status)) {
      return colors.PENDING
    }
    if (usersStore.isStatusMissing(status)) {
      return colors.TODO
    }
    return colors.WRONG
  }
}

export default translate("translations")(RegisterScreen);
