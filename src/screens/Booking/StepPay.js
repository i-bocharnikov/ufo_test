import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform, processColor } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io';
import stripe from 'tipsi-stripe';
import _ from 'lodash';

import { bookingStore, driveStore } from './../../stores';
import { keys as screenKeys } from './../../navigators/helpers';
import {
  UFOContainer,
  UFOIcon,
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
import { checkAndRequestCameraPermission } from './../../utils/permissions';
import { confirm } from './../../utils/interaction';

const CREDIT_CARD_DEFAULT_IMG = 'https://resources.ufodrive.com/images/userCreditCards/unknown.png';

@observer
class StepPayScreen extends Component {
  constructor(props) {
    super(props);
    this.CARDIO_SCAN_OPTIONS = {
      languageOrLocale: props.i18n.language,
      guideColor: Platform.OS === 'ios' ? processColor(colors.MAIN_COLOR) : colors.MAIN_COLOR,
      hideCardIOLogo: true,
      usePaypalActionbarIcon: false
    };
    this.handleInputVoucher = _.debounce(this.validateAndApplyVoucher, 300);
    this.agreementConfirmed = false;
    this.state = {
      showVoucherTooltip: false,
      isVoucherValid: null,
      voucherInvalidError: ''
    };
  }

  async componentDidMount() {
    await bookingStore.getUserPaymentOptions();
    stripe.setOptions({ publishableKey: bookingStore.stripeApiKey });

    if (Platform.OS === 'ios') {
      await CardIOUtilities.preload();
    }

    if (bookingStore.voucherCode) {
      const voucherInvalidError = await bookingStore.validateVoucher(bookingStore.voucherCode);
      this.setState({
        isVoucherValid: !voucherInvalidError,
        voucherInvalidError
      });
    }
  }

  render() {
    const { t } = this.props;
    const { isVoucherValid, voucherInvalidError } = this.state;

    return (
      <BookingNavWrapper
        navBack={this.navBack}
        navToFirstStep={this.navBack}
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
            style={[ styles.actionBtnDark, styles.scanCardBtn ]}
          >
            <Text style={styles.actionBtnDarkLabel}>
              {t('scanCreditCardBtn')}
            </Text>
          </TouchableOpacity>
          <Text style={[ styles.sectionTitle, styles.sectionTitleIndents ]}>
            {t('loyalityProgramtitle')}
          </Text>
          <UFOTextInput
            containerStyle={styles.screenHorizIndents}
            wrapperStyle={[
              styles.voucherInput,
              styles.blockShadow,
              Platform.OS === 'android' && styles.blockShadowAndroidFix
            ]}
            placeholder={t('voucherPlaceholder')}
            autoCapitalize="characters"
            onChangeText={this.handleInputVoucher}
            defaultValye={bookingStore.voucherCode}
            invalidStatus={_.isBoolean(isVoucherValid) && !isVoucherValid}
            successStatus={_.isBoolean(isVoucherValid) && isVoucherValid}
            alertMessage={voucherInvalidError}
          />
          {this.renderLoyaltyBlock()}
          {this.renderBookingInfoSection()}
          {this.renderVoucherTooltip()}
          <UFOModalLoader
            isVisible={bookingStore.isLoading}
            stealthMode={true}
          />
        </UFOContainer>
      </BookingNavWrapper>
    );
  }

  renderBottomPanel = () => {
    const isVoucherInvalid = _.isBoolean(this.state.isVoucherValid) && !this.state.isVoucherValid;

    return (
      <BottomActionPanel
        action={this.handleToNextStep}
        actionTitle={this.props.t('stepPayNextTitle')}
        actionSubTitle={this.props.t('stepPayNextSubTitle')}
        isAvailable={!!bookingStore.currentCreditCardRef && !isVoucherInvalid}
        isWaiting={bookingStore.isLoading}
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
      <TouchableOpacity
        style={[ styles.actionBtnDark, styles.loyalityBtn ]}
        onPress={bookingStore.switchReferralUsing}
        activeOpacity={values.BTN_OPACITY_DEFAULT}
      >
        <TouchableOpacity
          onPress={() => this.setState({ showVoucherTooltip: true })}
          ref={ref => (this.voucherTooltipRef = ref)}
        >
          <UFOIcon
            name="ios-information-circle-outline"
            style={styles.loyalityTolltipIcon}
          />
        </TouchableOpacity>
        <Text
          style={styles.actionBtnDarkLabel}
          numberOfLines={1}
        >
          {bookingStore.loyaltyProgramInfo}
        </Text>
        {bookingStore.useRefferalAmount && (
          <UFOIcon
            name="md-checkmark"
            style={styles.loyalityIcon}
          />
        )}
      </TouchableOpacity>
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
          <Text style={[ styles.infoTitle, styles.infoBlockCarImgIndent ]}>
            {t('subTitleStep3')} : {bookingStore.orderPrice}
          </Text>
          <Text style={[ styles.infoText, styles.infoBlockCarImgIndent ]}>
            {bookingStore.order.location.name}
          </Text>
          <Text style={[ styles.infoText, styles.infoBlockCarImgIndent ]}>
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
      const hasPermit = await checkAndRequestCameraPermission();
      const options = { ...this.CARDIO_SCAN_OPTIONS, noCamera: !hasPermit };
      const cardIoData = await CardIOModule.scanCard(options);
      const cardStripeObj = await stripe.createTokenWithCard({
        number: cardIoData.cardNumber,
        expMonth: cardIoData.expiryMonth,
        expYear: cardIoData.expiryYear,
        cvc: cardIoData.cvv
      });
      bookingStore.addCreditCardToList({ ...cardStripeObj, imageUrl: CREDIT_CARD_DEFAULT_IMG });
    } catch (error) {
      console.log('CARDIO ERROR:', error);
    }
  };

  /*
   * Apply voucher code, receive new order object into bookingStore
  */
  validateAndApplyVoucher = async code => {
    let isValid = null;
    let voucherInvalidError = '';

    if (code) {
      voucherInvalidError = await bookingStore.validateVoucher(code);
      isValid = !voucherInvalidError;
    }

    this.setState({ isVoucherValid: isValid, voucherInvalidError });

    if (isValid) {
      await bookingStore.appyVoucherCode(code);
    } else if (bookingStore.voucherCode) {
      await bookingStore.resetVoucherCode();
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
    if (!this.agreementConfirmed) {
      const confirmAction = () => { this.agreementConfirmed = true; };
      await confirm('', this.props.t('ageConfirmation'), confirmAction);
    }

    if (!this.agreementConfirmed) {
      return;
    }

    await bookingStore.confirmBooking();

    if (bookingStore.bookingConfirmation) {
      await driveStore.reset();
      this.props.navigation.replace(screenKeys.BookingStepDrive);
    }
  };
}

export default translate('booking')(StepPayScreen);
