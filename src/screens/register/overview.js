import React, { Component } from "react";
import { Container, Content, Button, Text, ListItem, Left, Icon, Body, Right, Card, CardItem } from 'native-base';
import { observer } from 'mobx-react';
import { translate } from "react-i18next";

import HeaderComponent from "../../components/header";
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import usersStore from '../../stores/usersStore';
import { screens, styles, icons, colors } from '../../utils/global'

@observer
class RegisterScreen extends Component {


  //To be Used only to move to another screen
  async componentWillMount() {

    let user = usersStore.user
    if (usersStore.isStatusMissing(user.phone_number_status)) {
      this.props.navigation.navigate(screens.REGISTER_PHONE)
      return
    }
    if (usersStore.isStatusMissing(user.email_status)) {
      this.props.navigation.navigate(screens.REGISTER_EMAIL)
      return
    }
  }

  render() {

    const { t } = this.props;
    let actions = [
      {
        style: styles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME)
      },
    ]

    let user = usersStore.user
    let phoneNumberColor = this.getColorForStatus(user.phone_number_status)
    let emailColor = this.getColorForStatus(user.email_status)
    let addressColor = this.getColorForStatus(user.address_status)
    let identificationColor = this.getColorForStatus(user.identification_status)
    let driverLicenceColor = this.getColorForStatus(user.driver_licence_status)
    return (
      <Container>
        <HeaderComponent title={t('register:overviewTitle', { user: user })} subTitle={'STATUS:' + user.status} />
        <Content padder>
          <Card >
            <CardItem>
              <Body>
                <Text>
                  {user.registration_message}
                </Text>
              </Body>
            </CardItem>
          </Card>
          <ListItem icon onPress={() => this.props.navigation.navigate(screens.REGISTER_PHONE)}>
            <Left>
              <Button style={{ backgroundColor: phoneNumberColor }}>
                <Icon active name="phone-portrait" />
              </Button>
            </Left>
            <Body>
              <Text>{t('register:phoneNumberLabel')}</Text>
            </Body>
            <Right>
              <Text>{usersStore.user.phone_number}</Text>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon onPress={() => this.props.navigation.navigate(screens.REGISTER_EMAIL)}>
            <Left>
              <Button style={{ backgroundColor: emailColor }}>
                <Icon active name="mail" />
              </Button>
            </Left>
            <Body>
              <Text>{t('register:emailLabel')}</Text>
            </Body>
            <Right>
              <Text>{usersStore.user.email}</Text>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: addressColor }}>
                <Icon active name="bluetooth" />
              </Button>
            </Left>
            <Body>
              <Text>{t('register:addressLabel')}</Text>
            </Body>
            <Right>
              <Text>{usersStore.user.address}</Text>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
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
