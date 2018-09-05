import React, { Component } from "react";
import { Container, H1, Content, Button, Text, StyleProvider, Header, ListItem, Left, Icon, Body, Right, Switch, Card, CardItem } from 'native-base';
import getTheme from '../../../native-base-theme/components';
import CounterStore from '../../stores/counterStore.js';
import { observer } from 'mobx-react';

@observer
class RegisterScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'User ' + navigation.getParam('reference', '') + ' preference',
    };
  };

  render() {

    const { navigation } = this.props
    const reference = navigation.getParam('reference', 'NO-REFERENCE')

    return (
      <StyleProvider style={getTheme()}>
        <Container>

          <Card>
            <CardItem header>
              <Text>NativeBase</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  The counter is [{CounterStore.counter}]
                </Text>
              </Body>
            </CardItem>
          </Card>
          <Button primary block onPress={() => CounterStore.increment()}>
            <Text>Increment</Text>
          </Button>
          <Button primary block onPress={() => CounterStore.decrement()}>
            <Text>Decrement</Text>
          </Button>

          <Content>
            <ListItem icon>
              <Left>
                <Button success>
                  <Icon active name="phone-portrait" />
                </Button>
              </Left>
              <Body>
                <Text>Phone Number</Text>
              </Body>
              <Right>
                <Text>+352XXXXXXXXX</Text>
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "#007AFF" }}>
                  <Icon active name="mail" />
                </Button>
              </Left>
              <Body>
                <Text>Email Address</Text>
              </Body>
              <Right>
                <Text>stany.blanvalet@ufodrive.com</Text>
                <Icon active name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Button style={{ backgroundColor: "#007AFF" }}>
                  <Icon active name="bluetooth" />
                </Button>
              </Left>
              <Body>
                <Text>navigate</Text>
              </Body>
              <Right>
                <Text>Adam Street 12</Text>
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
