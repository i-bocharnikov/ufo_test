import React, { Component } from "react";
import { translate } from "react-i18next";

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage } from '../../components/common'
import { screens, actionStyles, icons } from '../../utils/global'

class ReserveLocationScreen extends Component {

  render() {

    const { t, navigation } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME.name)
      },
      {
        style: actionStyles.TODO,
        icon: icons.NEXT,
        onPress: () => this.props.navigation.navigate(screens.RESERVE_DATE_AND_CAR.name)
      },
    ]
    return (
      <UFOContainer>
        <UFOHeader t={t} navigation={navigation} title={t('register:reserveLocationTitle')} currentScreen={screens.RESERVE_LOCATION} />
        <UFOActionBar actions={actions} />
      </UFOContainer>

    );
  }
}

export default translate("translations")(ReserveLocationScreen);
