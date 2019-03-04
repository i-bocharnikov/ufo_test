import React, { Component, Fragment } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Share,
  Platform,
  RefreshControl
} from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';

import { registerStore } from './../../stores';
import { UFOContainer, UFOIcon, UFOImage } from './../../components/common';
import UFOTooltip from './../../components/UFOTooltip';
import styles from './styles';
import { values, images } from './../../utils/theme';

@observer
class LoyalityInfo extends Component {
  @observable refreshing = false;
  @observable showDateTooltip = false;

  render() {
    return (
      <UFOContainer style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              onRefresh={this.refreshData}
              refreshing={this.refreshing}
            />
          }
        >
          {this.renderCreditInfoBlock()}
          {this.renderReferralBlock()}
          {this.renderPrtnerBlock()}
          <UFOTooltip
            isVisible={this.showDateTooltip}
            onClose={() => { this.showDateTooltip = false; }}
            originBtn={this.dateTooltipRef}
          >
            {this.props.t('creditTooltip')}
          </UFOTooltip>
        </ScrollView>
      </UFOContainer>
    );
  }

  renderCreditInfoBlock = () => {
    const { t } = this.props;

    return (
      <View style={[ styles.creditInfoBlock, styles.blockShadow ]}>
        <Text style={styles.creditHeader}>
          {t('creditInfoTitle')}
        </Text>
        <Text style={styles.creditValue}>
          {registerStore.creditAmountLabel}
        </Text>
        <Text style={styles.creditDescription}>
          {t('creditInfoDescr')}
        </Text>
        <UFOImage
          source={images.clippedMeteorite}
          style={styles.creditInfoBG}
        />
        <TouchableOpacity
          onPress={() => { this.showDateTooltip = true; }}
          ref={ref => { this.dateTooltipRef = ref; }}
          style={styles.creditTolltipBtn}
          activeOpacity={values.BTN_OPACITY_DEFAULT}
        >
          <UFOIcon
            name="ios-information-circle-outline"
            style={styles.creditTolltipIcon}
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderReferralBlock = () => {
    const { t } = this.props;
    const code = registerStore.user.referral_code || 'RSBL0';

    if (!code) {
      return null;
    }

    return (
      <Fragment>
        <Text style={styles.shareReferralTitle}>
          {t('creditShareTitle')}
        </Text>
        <Text style={styles.shareReferralDescr}>
          {t('creditShareDescr')}
        </Text>
        <TouchableOpacity
          onPress={this.shareRefCode}
          style={[ styles.shareReferralBtn, styles.blockShadow ]}
          activeOpacity={values.BTN_OPACITY_DEFAULT}
        >
          <Text style={styles.shareReferralCode}>
            {code.toUpperCase()}
          </Text>
          <UFOImage
            source={images.shareRef}
            style={styles.shareReferralIcon}
          />
        </TouchableOpacity>
      </Fragment>
    );
  };

  renderPrtnerBlock = () => {
    const { t } = this.props;
    const milesNum = registerStore.user.miles_and_more || '123465789';

    if (!milesNum) {
      return null;
    }

    return (
      <Fragment>
        <Text style={styles.shareReferralTitle}>
          {t('prtnerBlockTitle')}
        </Text>
        <View style={[ styles.milesBlock, styles.blockShadow ]}>
          <Text style={styles.milesTitle}>
            {t('milesTitle')}
          </Text>
          <Text style={styles.milesLabel}>
            {milesNum}
          </Text>
        </View>
      </Fragment>
    );
  };

  shareRefCode = () => {
    const code = registerStore.user.referral_code;
    const message = this.props.t('referalCodeMessage', { code });

    const content = { message };
    const options = {};

    if (Platform.OS === 'android') {
      options.dialogTitle = this.props.t('shareDialogTitle');
    }

    Share.share(content, options);
  };

  refreshData = async () => {
    this.refreshing = true;
    await registerStore.getUserData();
    this.refreshing = false;
  };
}

export default translate('register')(LoyalityInfo);
