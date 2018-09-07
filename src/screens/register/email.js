import React, { Component } from "react";
import usersStore from '../../stores/usersStore';
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import { StyleSheet, View, Text } from 'react-native';
import ActionBarComponent from '../../components/actionBar'
import _ from 'lodash'

@observer
class EmailScreen extends Component {

  static navigationOptions = ({ navigation, navigationOptions, screenProps }) => {
    return {
      title: navigation.getParam('title', 'Registration - Email'),
    };
  };

  async componentDidMount() {
    this.props.navigation.setParams({ title: this.props.t('register:emailTitle', { user: usersStore.user }) })
  }



  render() {

    const { t, i18n } = this.props;
    let actions = [
      {
        style: 'active',
        icon: 'arrow-round-back',
        text: 'previous',
        onPress: () => this.props.navigation.pop()
      },
      {
        style: 'active',
        icon: 'home',
        text: 'Home',
        onPress: () => this.props.navigation.navigate('Home')
      },
      {
        style: 'todo',
        icon: 'arrow-round-forward',
        text: 'Next',
        onPress: () => this.props.navigation.navigate('Payment')
      },
    ]
    return (
      <View style={styles.container}>


        < View style={styles.item}>
          <Text>{t('register:emailInputLabel')}</Text>

        </View>


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

export default translate("translations")(EmailScreen);
