import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Dimensions, WebView } from 'react-native'
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer } from './../../components/common';
import { screens, actionStyles, icons } from './../../utils/global'
import { driveStore, termStore } from './../../stores'
import { showPrompt, toastError } from './../../utils/interaction';

const window = Dimensions.get('window');
const BACKGROUND_WIDTH = Dimensions.get('window').width * 1.5;
const BACKGROUND_HEIGHT = BACKGROUND_WIDTH / 2;
const CAR_WIDTH = Dimensions.get('window').width / 2;
const CAR_HEIGHT = CAR_WIDTH / 2;

@observer
class InspectScreen extends Component {

  @observable refreshing = false;

  async componentDidMount() {
    await this.refresh();
  }

  render() {
    const { t, navigation } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.CANCEL,
        onPress: () => navigation.navigate(screens.DRIVE.name)
      },
      {
        style: termStore.term.html ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.SIGN,
        onPress: this.confirmContractSignature
      },
    ];

    return (
      <UFOContainer image={screens.RENTAL_AGREEMENT.backgroundImage}>
        <UFOHeader
          t={t}
          navigation={navigation}
          currentScreen={screens.DRIVE}
          title={t('term:rentalAgreementTitle', {rental: driveStore.rental})}
        />
        <WebView
          ref={ref => (this.webView = ref)}
          source={{html: termStore.term.html}}
        />
        <UFOActionBar
          actions={actions}
          inverted
        />
      </UFOContainer>
    );
  }

  @action
  refresh = async () => {
    this.refreshing = true;
    await termStore.getRentalAgreement();
    this.refreshing = false;
  };

  @action
  doSign = async () => {
    const isSign = await termStore.signRentalAgreement();
    if (isSign) {
      await driveStore.refreshRental();
      this.props.navigation.navigate(screens.DRIVE.name);
    }
  };

  confirmContractSignature = () => {
    const t = this.props.t;
    const confirmKey = t('term:confirmContractKeyString');

    showPrompt(
      t('term:confirmContractTitle', {strKey: confirmKey}),
      t('term:confirmContractDescription'),
      str => str === confirmKey
        ? this.doSign()
        : toastError(t('error:stringNotMatch'), 160)
    );
  };
}

export default translate('translations')(InspectScreen);
