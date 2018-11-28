import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io';

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
import { values } from './../../utils/theme';

@observer
class StepPayScreen extends Component {
  async componentDidMount() {
    const hasOptions = await bookingStore.getUserPaymentOptions();

    if (!hasOptions) {
      // propose/scan card
    }
  }

  constructor() {
    super();
    this.state = {
      showVoucherTooltip: false
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
        <UFOContainer style={styles.screenPaymentContainer}>
          <Text style={[ styles.sectionTitle, styles.sectionTitleIndents ]}>
            {t('creditCardTitle')}
          </Text>
          {bookingStore.userCreditCards.map(item => this.renderCreditCardsList(item))}


          {this.renderCreditCardsList({
            reference: 'card_1DZhW5KVP4j7hWqd7SxLykGF',
            default: true,
            brand: 'Visa',
            country: 'US',
            expMonth: 4,
            expYear: 2024,
            last4: 4242,
            name: null
          })}
          {this.renderCreditCardsList({
            reference: 'card_1DZhW5KVP4j7hWqd7SxLykGG',
            default: false,
            brand: 'MasterCard',
            country: 'US',
            expMonth: 4,
            expYear: 2024,
            last4: 8193,
            name: null
          })}
          {this.renderCreditCardsList({
            reference: 'card_1DZhW5KVP4j7hWqd7SxLykGD',
            default: false,
            brand: 'AMEX',
            country: 'US',
            expMonth: 4,
            expYear: 2024,
            last4: 1157,
            name: null
          })}


          <TouchableOpacity
            onPress={this.scranCreditCard}
            activeOpacity={values.BTN_OPACITY_DEFAULT}
            style={[ styles.actionBtn, styles.scanCardBtn ]}
          >
            <Text style={styles.actionBtnLabel}>
              {t('scanCreditCardBtn')}
            </Text>
          </TouchableOpacity>
          <Text style={[ styles.sectionTitle, styles.sectionTitleIndents ]}>
            {t('loyalityProgramtitle')}
          </Text>
          <View style={[ styles.row, styles.screenHorizIndents, styles.blockShadow ]}>
            <UFOTextInput
              wrapperStyle={styles.voucherInput}
              keyboardType="numeric"
              placeholder={t('voucherPlaceholder')}
              defaultValue={bookingStore.voucherCode}
              onChangeText={value => (bookingStore.voucherCode = value)}
            />
            <TouchableOpacity
              onPress={this.applyVoucher}
              activeOpacity={values.BTN_OPACITY_DEFAULT}
              style={styles.voucherApplyBtn}
            >
              <Text style={styles.voucherApplyLabel}>
                {t('applyBtn')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loyalityBlock}>
            <UFOIcon_next
              name="ios-planet-outline"
              style={styles.loyalityIcon}
            />
            <Text
              style={styles.loyalityLabel}
              numberOfLines={1}
            >
              You have €30 on you account
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
          {this.renderBookingInfoSection()}
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

  renderCreditCardsList = data => {
    return (
      <View
        key={data.reference}
        style={styles.creditCardItem}
      >
        <View>
          <Text>o</Text>
        </View>
        <View>
          <Text>**** **** **** {data.last4}</Text>
          <Text>{data.brand}</Text>
        </View>
      </View>
    );
  };

  renderBookingInfoSection = () => {
    const { t } = this.props;

    return (
      <View style={styles.infoSectionWrapper}>
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
      </View>
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

  scranCreditCard = () => {
    console.log('SCAN CARD HANDLER');
  };

  applyVoucher = () => {
    console.log('APPLY VOUCHER ACTION');
  };
}

export default translate('booking')(StepPayScreen);
