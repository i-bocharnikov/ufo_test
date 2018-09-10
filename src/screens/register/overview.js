import React, { Component } from "react";
import { Container, Content, Button, Text, ListItem, Left, Body, Right, Card, CardItem, List } from 'native-base';
import { Image } from 'react-native'
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

import { observable } from "mobx";

@observer
class RegisterScreen extends Component {


  @observable identificationFrontDocument = "loading"
  @observable identificationBackDocument = "loading"
  @observable driverLicenceFrontDocument = "loading"
  @observable driverLicenceBackDocument = "loading"

  //To be Used only to move to another screen
  async componentWillMount() {

    let user = usersStore.user
    if (_.isEmpty(user.phone_number)) {
      this.props.navigation.navigate(screens.REGISTER_PHONE)
      return
    }
    if (_.isEmpty(user.email)) {
      this.props.navigation.navigate(screens.REGISTER_EMAIL)
      return
    }
    if (_.isEmpty(user.address)) {
      this.props.navigation.navigate(screens.REGISTER_ADDRESS)
      return
    }

    if (user.identification_scan_front_side) {

      this.identificationFrontDocument = "data:image/png;base64," + (await usersStore.downloadDocument(user.identification_scan_front_side.reference))
    } else {
      this.identificationFrontDocument = null
    }
    if (user.identification_scan_back_side) {
      this.identificationBackDocument = "data:image/png;base64," + (await usersStore.downloadDocument(user.identification_scan_back_side.reference))
    } else {
      this.identificationBackDocument = null
    }
    if (user.driver_licence_scan_front_side) {
      this.driverLicenceFrontDocument = "data:image/png;base64," + (await usersStore.downloadDocument(user.driver_licence_scan_front_side.reference))
    } else {
      this.driverLicenceFrontDocument = null
    }
    if (user.driver_licence_scan_back_side) {
      this.driverLicenceBackDocument = "data:image/png;base64," + (await usersStore.downloadDocument(user.driver_licence_scan_back_side.reference))
    } else {
      this.driverLicenceBackDocument = null
    }

  }

  render() {

    const { t } = this.props;
    let user = usersStore.user
    let isUserConnected = !usersStore.isUserRegistrationMissing
    let actions = [
      {
        style: styles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME)
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

    let phoneNumberColor = this.getColorForStatus(user.phone_number_status)
    let emailColor = this.getColorForStatus(user.email_status)
    let addressColor = this.getColorForStatus(user.address_status)
    let identificationColor = this.getColorForStatus(user.identification_status)


    let driverLicenceColor = this.getColorForStatus(user.driver_licence_status)
    return (
      <Container>
        <HeaderComponent title={t('register:overviewTitle', { user: user })} />
        <Content padder>
          <List>
            <ListItem>
              <Body>
                <Card >
                  <CardItem>
                    <Body>
                      <Text>
                        {user.registration_message}
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              </Body>
            </ListItem>
            <ListItem icon onPress={() => this.props.navigation.navigate(screens.REGISTER_PHONE)}>
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
            <ListItem icon onPress={() => this.props.navigation.navigate(screens.REGISTER_EMAIL)}>
              <Left>
                <Button style={{ backgroundColor: emailColor }}>
                  <Icon icon={icons.EMAIL} size={sizes.SMALL} color={colors.TEXT} />
                </Button>
              </Left>
              <Body>
                <Text>{t('register:emailLabel')}</Text>
              </Body>
              <Right>
                <Text>{usersStore.user.email}</Text>
                <Icon style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} color={colors.TEXT} />
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.props.navigation.navigate(screens.REGISTER_ADDRESS)}>
              <Left>
                <Button style={{ backgroundColor: addressColor }}>
                  <Icon icon={icons.ADDRESS} size={sizes.SMALL} color={colors.TEXT} />
                </Button>
              </Left>
              <Body>
                <Text>{t('register:addressLabel')}</Text>
              </Body>
              <Right>
                <Text>{usersStore.user.address}</Text>
                <Icon style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} color={colors.TEXT} />
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.props.navigation.navigate(screens.REGISTER_IDENTIFICATION)}>
              <Left>
                <Button style={{ backgroundColor: identificationColor }}>
                  <Icon icon={icons.IDENTIFICATION} size={sizes.SMALL} color={colors.TEXT} />
                </Button>
              </Left>
              <Body>
                <Text>{t('register:identificationLabel')}</Text>
              </Body>
              <Right >

                <Thumbnail source={this.identificationFrontDocument} />
                <Thumbnail source={this.identificationBackDocument} />
                <Icon style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} color={colors.TEXT} />
              </Right>
            </ListItem>
            <ListItem icon onPress={() => this.props.navigation.navigate(screens.REGISTER_DRIVER_LICENCE)}>
              <Left>
                <Button style={{ backgroundColor: driverLicenceColor }}>
                  <Icon icon={icons.DRIVER_LICENCE} size={sizes.SMALL} color={colors.TEXT} />
                </Button>
              </Left>
              <Body>
                <Text>{t('register:driverLicenceLabel')}</Text>
              </Body>
              <Right >
                <Thumbnail source={this.driverLicenceFrontDocument} />
                <Thumbnail source={this.driverLicenceBackDocument} />
                <Icon style={{ paddingLeft: 5 }} icon={icons.SELECT} size={sizes.SMALL} color={colors.TEXT} />
              </Right>
            </ListItem>
          </List>
        </Content>
        <ActionSupportComponent onPress={() => this.props.navigation.navigate(screens.SUPPORT, { context: screens.REGISTER_OVERVIEW })} />
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
