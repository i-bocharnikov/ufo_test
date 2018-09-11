import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Content } from 'native-base';

import HeaderComponent from "../components/header";
import ActionBarComponent from '../components/actionBar'
import { styles, icons } from '../utils/global'

class SupportScreen extends Component {

  render() {
    const { t, navigation } = this.props;
    const context = navigation.getParam('context');

    let actions = [
      {
        style: styles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      },
    ]
    return (
      <Container>
        <HeaderComponent t={t} title={t('support:supportTitle')} subTitle={context} />
        <Content padder>
        </Content>
        <ActionBarComponent actions={actions} />
      </Container>
    );
  }
}
export default translate("translations")(SupportScreen);
