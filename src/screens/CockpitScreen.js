import React, { Component } from "react";
import { Container, H1, Content, Button, Text, StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';

class CockpitScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Rental ' + navigation.getParam('reference', 'NO-REFERENCE'),
    };
  };

  render() {

    const { navigation } = this.props
    const reference = navigation.getParam('reference', 'NO-REFERENCE')

    return (
      <StyleProvider style={getTheme()}>
        <Container>
          <Content>
            <H1>Rental {reference}</H1>
          </Content>
          <Content>
            <Button transparent onPress={() => this.props.navigation.push('Cockpit', { reference: 'BLU0' + Math.floor(Math.random() * 100) })}>
              <Text>Go to Another COCKPIT... again</Text>
            </Button>
            <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
              <Text>Go to HOME</Text>
            </Button>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Text>Go BACK</Text>
            </Button>
          </Content>
        </Container>
      </StyleProvider >
    );
  }
}



export default CockpitScreen;
