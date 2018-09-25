import React, { Component } from "react";
import { translate } from "react-i18next";
import { Content } from 'native-base';

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage } from '../../components/common'
import { screens, actionStyles, icons } from '../../utils/global'

class ReserveDateAndCarScreen extends Component {

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
        onPress: () => this.props.navigation.navigate(screens.HOME.name)
      },
      {
        style: actionStyles.TODO,
        icon: icons.NEXT,
        onPress: () => this.props.navigation.navigate(screens.RESERVE_PAYMENT.name)
      },
    ]
    return (
      <UFOContainer>
        <UFOHeader t={t} navigation={navigation} title={t('reserve:reserveDateAndCarTitle')} currentScreen={screens.RESERVE_DATE_AND_CAR} />

        <Content padder>
        </Content>
        <UFOActionBar actions={actions} />
      </UFOContainer>

    );
  }
}

export default translate("translations")(ReserveDateAndCarScreen);
