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
import { showPrompt, showToastError } from './../../utils/interaction';
import { NavigationEvents } from 'react-navigation';
import userActionsLogger, {
  severityTypes,
  codeTypes
} from '../../utils/userActionsLogger';

@observer
class InspectScreen extends Component {
  @observable activityPending = false;

  componentWillMount() {
    this.refresh();
  }

  @action
  refresh = async () => {
    this.activityPending = true;
    await termStore.getRentalAgreement();
    this.activityPending = false;
  };

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
        <NavigationEvents onWillFocus={() => this.refresh()} />
        <UFOHeader
          t={t}
          navigation={navigation}
          currentScreen={screens.DRIVE}
          title={t('term:rentalAgreementTitle', {
            rental: driveStore.rental
          })}
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
  doSign = async () => {
    const isSign = await termStore.signRentalAgreement();

    if (isSign) {
      await driveStore.refreshRental();
      this.props.navigation.navigate(screens.DRIVE.name);
    }
  };

  confirmContractSignature = () => {
    this.activityPending = true;
    const t = this.props.t;
    const confirmKey = t('term:confirmContractKeyString');

    const promptHandler = str => {
      if (str.toUpperCase().trim() === confirmKey.toUpperCase()) {
        userActionsLogger(
          severityTypes.INFO,
          codeTypes.SUCCESS,
          'confirmContractSignature',
          'confirmation accepted',
          `Input ${str} does match confirmKey ${confirmKey}`
        );
        this.doSign();
        this.activityPending = false;
        return;
      }

      userActionsLogger(
        severityTypes.ERROR,
        codeTypes.ERROR,
        'confirmContractSignature',
        t('error:stringNotMatch'),
        `Input ${str} does not match confirmKey ${confirmKey}`
      );

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

export default translate()(InspectScreen);
