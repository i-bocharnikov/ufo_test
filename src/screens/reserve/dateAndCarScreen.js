import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Content } from 'native-base';

import HeaderComponent from "../../components/header";
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import { screens, styles, icons } from '../../utils/global'

class ReserveDateAndCarScreen extends Component {

  render() {

    const { t } = this.props;
    let actions = [

      {
        style: styles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      },
      {
        style: styles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME)
      },
      {
        style: styles.TODO,
        icon: icons.NEXT,
        onPress: () => this.props.navigation.navigate(screens.RESERVE_PAYMENT)
      },
    ]
    return (
      <Container>
        <HeaderComponent t={t} title={t('reserve:reserveDateAndCarTitle')} />
        <Content padder>
        </Content>
        <ActionSupportComponent onPress={() => this.props.navigation.navigate(screens.SUPPORT, { context: screens.RESERVE_DATE_AND_CAR })} />
        <ActionBarComponent actions={actions} />
      </Container>

    );
  }
}

export default translate("translations")(ReserveDateAndCarScreen);
