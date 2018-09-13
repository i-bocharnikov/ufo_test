import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Content } from 'native-base';

import HeaderComponent from "../../components/header";
import ActionBarComponent from '../../components/actionBar'
import { screens, actionStyles, icons, supportContexts } from '../../utils/global'

class ReservePaymentScreen extends Component {

  render() {
    const { t, navigation } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      },
      {
        style: actionStyles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME)
      },
      {

        style: actionStyles.TODO,
        icon: icons.PAY,
        onPress: () => { this.props.navigation.popToTop(); this.props.navigation.navigate(screens.HOME) }
      },
    ]
    return (
      <Container>
        <HeaderComponent t={t} navigation={navigation} title={t('register:reservePaymentTitle')} supportContext={supportContexts.RESERVE} />
        <Content padder>
        </Content>
        <ActionBarComponent actions={actions} />
      </Container>

    );
  }
}

export default translate("translations")(ReservePaymentScreen);
