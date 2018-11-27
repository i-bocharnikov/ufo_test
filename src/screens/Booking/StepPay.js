import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';

import { bookingStore } from './../../stores';
import { keys as screenKeys } from './../../navigators/helpers';
import {
  UFOContainer,
  UFOIcon_next,
  UFOModalLoader,
  UFOImage,
  UFOTextInput
} from './../../components/common';
import UFOTooltip from './../../components/UFOTooltip';
import BookingNavWrapper from './components/BookingNavWrapper';
import BottomActionPanel from './components/BottomActionPanel';
import styles from './styles';

@observer
class StepPayScreen extends Component {
  constructor() {
    super();
    this.state = {
      showVoucherTooltip: false,
      showCVCTooltip: false
    };
  }

  render() {
    const { t } = this.props;

    return (
      <BookingNavWrapper
        navBack={this.navBack}
        currentStep={2}
        BottomActionPanel={this.renderBottomPanel()}
      >
        <UFOContainer style={styles.screenContainer}>
          <Text style={[ styles.sectionTitle, styles.sectionTitleIndents ]}>
            {t('creditCardTitle')}
          </Text>

          <Text style={[ styles.sectionTitle, styles.sectionTitleIndents ]}>
            {t('loyalityProgramtitle')}
          </Text>
          <UFOTextInput
            wrapperStyle={[ styles.voucherInput, styles.blockShadow ]}
            keyboardType="numeric"
            placeholder={t('voucherPlaceholder')}
            defaultValue={bookingStore.voucherCode}
            onChangeText={value => (bookingStore.voucherCode = value)}
          />
          <View style={styles.loyalityBlock}>
            <UFOIcon_next
              name="ios-planet-outline"
              style={styles.loyalityIcon}
            />
            <Text
              style={styles.loyalityLabel}
              numberOfLines={1}
            >
              You have 10 pt = no reduction
            </Text>
            <TouchableOpacity
              onPress={() => this.setState({ showVoucherTooltip: true })}
              ref={ref => (this.voucherTooltipRef = ref)}
            >
              <UFOIcon_next
                name="ios-information-circle-outline"
                style={styles.loyalityTolltipIcon}
              />
            </TouchableOpacity>
          </View>
          <Text style={[ styles.sectionTitle, styles.sectionTitleIndents ]}>
            {t('infoAtPaymentTitle')}
          </Text>
          <View style={[ styles.infoBlock, styles.blockShadow ]}>
            <UFOImage
              style={styles.infoBlockCarImg}
              source={{ uri: bookingStore.order.carModel.imageUrl }}
              resizeMode="contain"
            />
            <Text style={styles.infoTitle}>
              {t('subTitleStep3')} : {bookingStore.orderPrice}
            </Text>
            <Text style={styles.infoText}>
              {bookingStore.order.location.name}
            </Text>
            <Text style={styles.infoText}>
              {bookingStore.order.carModel.name}
            </Text>
            <Text style={styles.infoText}>
              {t('common:scheduleFrom')} {bookingStore.rentalScheduleStart}
            </Text>
            <Text style={styles.infoText}>
              {t('common:scheduleTo')} {bookingStore.rentalScheduleEnd}
            </Text>
            <View style={[ styles.separateLine, styles.separateLineInfoBlock ]} />
            <View style={styles.row}>
              <Text style={styles.infoTitle}>
                {t('totalPricePayment')} :
              </Text>
              <Text style={styles.infoTitlePrice}>
                {bookingStore.orderPrice}
              </Text>
            </View>
          </View>
          {this.renderVoucherTooltip()}
          <UFOModalLoader isVisible={bookingStore.isLoading} />
        </UFOContainer>
      </BookingNavWrapper>
    );
  }

  renderBottomPanel = () => {
    const { t } = this.props;

    return (
      <BottomActionPanel
        t={t}
        action={this.navToNextStep}
        actionTitle={t('stepPayNextTitle')}
        actionSubTitle={t('stepPayNextSubTitle')}
        isAvailable={true}
        price={bookingStore.orderPrice}
      />
    );
  };

  renderVoucherTooltip = () => {
    return (
      <UFOTooltip
        isVisible={this.state.showVoucherTooltip}
        onClose={() => this.setState({ showVoucherTooltip: false })}
        originBtn={this.voucherTooltipRef}
      >
        {this.props.t('voucherTooltip')}
      </UFOTooltip>
    );
  };

  navBack = () => {
    this.props.navigation.goBack();
  };

  navToNextStep = () => {
    this.props.navigation.navigate(screenKeys.BookingStepDrive);
  };
}

export default translate('booking')(StepPayScreen);
