import React, { Component } from "react";
import { Container, Content, Button, Text, ListItem, Left, Body, Right, Card, CardItem, Thumbnail, List } from 'native-base';
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import _ from 'lodash'

import HeaderComponent from "../../components/header";
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import usersStore from '../../stores/usersStore';
import { screens, styles, icons, colors, sizes } from '../../utils/global'
import Icon from '../../components/Icon'

@observer
class RegisterScreen extends Component {


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
              <Right style={{ flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center' }}>
                <Thumbnail square source={{ uri: 'data:image/png;base64,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' }} />
                <Thumbnail square source={{ uri: 'data:image/png;base64,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' }} />
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
              <Right style={{ flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center' }}>
                <Thumbnail square source={{ uri: 'data:image/png;base64,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' }} />
                <Thumbnail square source={{ uri: 'data:image/png;base64,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' }} />
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
