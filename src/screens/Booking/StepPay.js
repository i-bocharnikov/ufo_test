import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, processColor } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io';
import stripe from 'tipsi-stripe';

import { bookingStore } from './../../stores';
import { keys as screenKeys } from './../../navigators/helpers';
import {
  UFOContainer,
  UFOIcon_next,
  UFOModalLoader,
  UFOImage,
  UFOTextInput,
  UFOGradientView
} from './../../components/common';
import UFOTooltip from './../../components/UFOTooltip';
import BookingNavWrapper from './components/BookingNavWrapper';
import BottomActionPanel from './components/BottomActionPanel';
import styles from './styles';
import { values, colors } from './../../utils/theme';

@observer
class StepPayScreen extends Component {
  constructor(props) {
    super(props);
    this.CARDIO_SCAN_OPTIONS = {
      languageOrLocale: props.i18n.language,
      guideColor: Platform.OS === 'ios' ? processColor(colors.MAIN_COLOR) : colors.MAIN_COLOR,
      hideCardIOLogo: true
    };
    this.state = {
      showVoucherTooltip: false,
      voucherCodeStr: ''
    };
  }

  async componentDidMount() {
    const hasOptions = await bookingStore.getUserPaymentOptions();
    stripe.setOptions({ publishableKey: bookingStore.stripeApiKey });

    if (Platform.OS === 'ios') {
      await CardIOUtilities.preload();
    }

    if (!hasOptions) {
      /* timeout needed to avoid conflict between modal views at fast re-render (ios) */
      setTimeout(this.scranCreditCard, 100);
    }
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
          {bookingStore.userCreditCards.map(item => this.renderCreditCardItem(item))}
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
          <View style={[
            styles.row,
            styles.screenHorizIndents,
            styles.blockShadow,
            Platform.OS === 'android' && styles.blockShadowAndroidFix
          ]}
          >
            <UFOTextInput
              wrapperStyle={styles.voucherInput}
              keyboardType="numeric"
              placeholder={t('voucherPlaceholder')}
              defaultValue={bookingStore.voucherCode}
              onChangeText={voucherCodeStr => this.setState({ voucherCodeStr })}
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
          {this.renderLoyaltyBlock()}
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
        action={this.handleToNextStep}
        actionTitle={t('stepPayNextTitle')}
        actionSubTitle={t('stepPayNextSubTitle')}
        isAvailable={Boolean(bookingStore.currentCreditCardRef)}
        price={bookingStore.orderPrice}
      />
    );
  };

  renderCreditCardItem = data => {
    const isActive = bookingStore.currentCreditCardRef === data.reference;

    return (
      <TouchableOpacity
        key={data.reference}
        onPress={() => (bookingStore.currentCreditCardRef = data.reference)}
        activeOpacity={values.BTN_OPACITY_DEFAULT}
      >
        <UFOGradientView
          style={[ styles.creditCardItem, isActive && styles.selectedCreditCardItem ]}
          topColor={colors.BG_INVERT}
          bottomColor={colors.BG_INVERT_TINT}
        >
          <View style={styles.row}>
            <View style={styles.radioCircle}>
              {isActive && <View style={styles.radioDot} />}
            </View>
            <UFOImage
              style={styles.creditCardImg}
              source={{ uri: data.imageUrl }}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.creditCardNum}>
              **** **** **** {data.last4}
            </Text>
            <Text style={styles.creditCardType}>
              {data.brand}
            </Text>
          </View>
        </UFOGradientView>
      </TouchableOpacity>
    );
  };

  renderLoyaltyBlock = () => {
    return !bookingStore.loyaltyProgramInfo ? null : (
      <View style={styles.loyalityBlock}>
        <TouchableOpacity
          style={styles.loyalityCheckbox}
          onPress={bookingStore.switchReferralUsing}
        >
          {bookingStore.useRefferalAmount && (
            <UFOIcon_next
              name="md-checkmark"
              style={styles.loyalityIcon}
            />
          )}
        </TouchableOpacity>
        <Text
          style={styles.loyalityLabel}
          numberOfLines={1}
        >
          {bookingStore.loyaltyProgramInfo}
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

  /*
   * Launch camera to credit card, then handle card with stripe and locally save it into card list
  */
  scranCreditCard = async () => {
    try {
      const cardIoData = await CardIOModule.scanCard(this.CARDIO_SCAN_OPTIONS);
      const cardStripeObj = await stripe.createTokenWithCard({
        number: cardIoData.cardNumber,
        expMonth: cardIoData.expiryMonth,
        expYear: cardIoData.expiryYear,
        cvc: cardIoData.cvv
      });
      bookingStore.addCreditCardToList(cardStripeObj);
    } catch (error) {
      console.log('CARDIO ERROR:', error);
    }
  };

  /*
   * Apply voucher code, receive new order object into bookingStore
  */
  applyVoucher = () => {
    const code = this.state.voucherCodeStr;
    if (code !== bookingStore.voucherCode) {
      bookingStore.appyVoucherCode(code);
    }
  };

  /*
   * To previous screen
  */
  navBack = () => {
    this.props.navigation.goBack();
  };

  /*
   * Handle payment and go to next step
  */
  handleToNextStep = async () => {
    const result = await bookingStore.confirmBooking();

    if (result) {
      this.props.navigation.navigate(screenKeys.BookingStepDrive);
    }
  };
}

export default translate('booking')(StepPayScreen);
