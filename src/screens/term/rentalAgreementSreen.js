import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { WebView } from 'react-native';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer } from './../../components/common';
import { screens, actionStyles, icons } from './../../utils/global';
import { driveStore, termStore } from './../../stores';
import { showPrompt, showToastError } from './../../utils/interaction';

@observer
class InspectScreen extends Component {
  @observable refreshing = false;
  @observable activityPending = false;

  async componentDidMount() {
    this.activityPending = true;
    await this.refresh();
    this.activityPending = false;
  }

  render() {
    const { t, navigation } = this.props;
    const actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.CANCEL,
        onPress: () => navigation.navigate(screens.DRIVE.name)
      },
      {
        style: termStore.term.html ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.SIGN,
        onPress: this.confirmContractSignature
      }
    ];

    return (
      <UFOContainer image={screens.RENTAL_AGREEMENT.backgroundImage}>
        <UFOHeader
          t={t}
          navigation={navigation}
          currentScreen={screens.DRIVE}
          title={t('term:rentalAgreementTitle', { rental: driveStore.rental })}
        />
        <WebView
          ref={ref => (this.webView = ref)}
          source={{ html: termStore.term.html }}
        />
        <UFOActionBar
          actions={actions}
          activityPending={this.activityPending}
          inverted={true}
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

    this.activityPending = false;
  };

  confirmContractSignature = () => {
    this.activityPending = true;
    const t = this.props.t;
    const confirmKey = t('term:confirmContractKeyString');

    const promptHandler = str => {
      if (str === confirmKey) {
        this.doSign();
        return;
      }

      showToastError(t('error:stringNotMatch'), 160);
      this.activityPending = false;
    };

    showPrompt(
      t('term:confirmContractTitle', { strKey: confirmKey }),
      t('term:confirmContractDescription'),
      promptHandler,
      () => (this.activityPending = false)
    );
  };
}

export default translate('translations')(InspectScreen);
