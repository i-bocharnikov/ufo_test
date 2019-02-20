import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { WebView } from 'react-native';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import _ from 'lodash';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer } from './../../components/common';
import { screens, actionStyles, icons } from './../../utils/global';
import { driveStore, termStore } from './../../stores';
import { showPrompt, showToastError, biometricConfirm } from './../../utils/interaction';
import remoteLoggerService from './../../utils/remoteLoggerService';

@observer
class InspectScreen extends Component {
  @observable activityPending = false;
  screenFocusListener = null;

  componentDidMount() {
    this.refresh();
    this.screenFocusListener = this.props.navigation.addListener('didFocus', this.refresh);
  }

  componentWillUnmount() {
    this.screenFocusListener.remove();
  }

  render() {
    const { t, navigation } = this.props;
    const html = termStore.term.html;
    const actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.CANCEL,
        onPress: () => navigation.goBack()
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
        {_.isString(html) && <WebView source={{ html }} />}
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
    this.activityPending = true;
    await termStore.getRentalAgreement();
    this.activityPending = false;
  };

  @action
  doSign = async () => {
    this.activityPending = true;
    const isSign = await termStore.signRentalAgreement();

    if (isSign) {
      await driveStore.refreshRental();
      this.props.navigation.navigate(screens.DRIVE.name);
    }

    this.activityPending = false;
  };

  confirmContractSignature = async () => {
    const t = this.props.t;
    const confirmKey = t('term:confirmContractKeyString');

    const promptHandler = async str => {
      if (str.toUpperCase().trim() === confirmKey.toUpperCase()) {
        await this.doSign();
        remoteLoggerService.info(
          'confirmContractSignature',
          `confirmation accepted: Input ${str} does match confirmKey ${confirmKey}`
        );
        return;
      }

      showToastError(t('error:stringNotMatch'), 160);
      this.activityPending = false;

      remoteLoggerService.error(
        'confirmContractSignature',
        `${t('error:stringNotMatch')}: Input ${str} does not match confirmKey ${confirmKey}`
      );
    };

    const biometricFallback = () => showPrompt(
      t('term:confirmContractTitle', { strKey: confirmKey }),
      t('term:confirmContractDescription'),
      promptHandler,
      () => { this.activityPending = false; }
    );

    biometricConfirm(this.doSign, biometricFallback);
  };
}

export default translate()(InspectScreen);
