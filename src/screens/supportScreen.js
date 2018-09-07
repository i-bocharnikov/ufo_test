import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Content } from 'native-base';

import HeaderComponent from "../components/header";
import ActionBarComponent from '../components/actionBar'
import { styles, icons } from '../utils/global'

class SupportScreen extends Component {

  render() {
    const { t } = this.props;
    let actions = [
      {
        style: styles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      },
    ]
    return (
      <Container>
        <HeaderComponent title={t('support:supportTitle')} />
        <Content padder>
        </Content>
        <ActionBarComponent actions={actions} />
      </Container>
    );
  }
}
export default translate("translations")(SupportScreen);
