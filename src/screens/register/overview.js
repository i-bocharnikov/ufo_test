import React, { Component } from "react";
import { Container, H1, Content, Button, Text, StyleProvider, Header, ListItem, Left, Icon, Body, Right, Switch, Card, CardItem } from 'native-base';
import getTheme from '../../../native-base-theme/components';
import usersStore from '../../stores/usersStore';
import { observer } from 'mobx-react';

@observer
class RegisterScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Registration ' + usersStore.user.reference,
    };
  };

  getColorForStatus = (status) => {
    switch (status) {
      case "missing":
        return "red"
      case "not_validated":
        return "orange"
      case "validated":
        return "green"
      default:
        return "grey"
    }
  }

  render() {

    let phoneNumberColor = this.getColorForStatus(usersStore.user.phone_number_status)
    let emailColor = this.getColorForStatus(usersStore.user.email_status)
    let addressColor = this.getColorForStatus(usersStore.user.address_status)
    let identificationColor = this.getColorForStatus(usersStore.user.identification_status)
    let driverLicenceColor = this.getColorForStatus(usersStore.user.driver_licence_status)
    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: phoneNumberColor }}>
                  <Icon active name="phone-portrait" />
                </Button>
              </Left>
              <Body>
                <Text>Phone</Text>
              </Body>
              <Right>
                <Text>{usersStore.user.phone_number}</Text>
                <Icon active name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: emailColor }}>
                  <Icon active name="mail" />
                </Button>
              </Left>
              <Body>
                <Text>Email</Text>
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
                <Text>Address</Text>
              </Body>
              <Right>
                <Text>{usersStore.user.address}</Text>
                <Icon active name="arrow-forward" />
              </Right>
            </ListItem>
          </Content>
        </Container>
      </StyleProvider >
    );
  }
}






export default RegisterScreen;
