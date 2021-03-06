import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
  processColor
} from 'react-native';
import { translate } from 'react-i18next';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io';
import stripe from 'tipsi-stripe';
import _ from 'lodash';

import { bookingStore, driveStore } from './../../stores';
import screenKeys from './../../navigators/helpers/screenKeys';
import {
  UFOContainer,
  UFOIcon,
  UFOLoader,
  UFOImage,
  UFOTextInput,
  UFOGradientView
} from './../../components/common';
import BookingNavWrapper from './components/BookingNavWrapper';
import BottomActionPanel from './components/BottomActionPanel';
import styles from './styles';
import { values, colors } from './../../utils/theme';
import { checkAndRequestCameraPermission } from './../../utils/permissions';
import { confirm } from './../../utils/interaction';

const CREDIT_CARD_DEFAULT_IMG =
  'https://resources.ufodrive.com/images/userCreditCards/unknown.png';

@observer
class StepPayScreen extends Component {
  @observable isPending = false;
  @observable voucherInvalidError = '';

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
  }

  async componentDidMount() {
    await bookingStore.getUserPaymentOptions();
    stripe.setOptions({ publishableKey: bookingStore.stripeApiKey });

    if (Platform.OS === 'ios') {
      await CardIOUtilities.preload();
    }

    if (bookingStore.voucherCode) {
      this.voucherInvalidError = await bookingStore.validateVoucher(bookingStore.voucherCode);
    }
  }

  render() {
    return (
      <BookingNavWrapper
        navBack={this.navBack}
        navToFaq={this.navToFaq}
        navToFirstStep={this.navBack}
        currentStep={2}
        isEditing={!!bookingStore.editableOrderRef}
        BottomActionPanel={this.renderBottomPanel()}
      >
        <UFOContainer style={styles.screenPaymentContainer}>
          {this.renderCreditCardBlock()}
          {this.renderLoyaltyBlock()}
          {this.renderBookingInfoSection()}
          <UFOLoader
            isVisible={bookingStore.isLoading}
            stealthMode={true}
          />
        </UFOContainer>
      </BookingNavWrapper>
    );
  }

  renderBottomPanel = () => (
    <BottomActionPanel
      action={this.handleToNextStep}
      actionTitle={this.props.t('stepPayNextTitle')}
      actionSubTitle={this.props.t('stepPayNextSubTitle')}
      isAvailable={!!bookingStore.currentCreditCardRef && !this.voucherInvalidError}
      isWaiting={bookingStore.isLoading || this.isPending}
      openPriceInfo={this.openPriceInfo}
    />
  );

  renderCreditCardBlock = () => {
    return bookingStore.isOrderPriceRefundOrZero ? null : (
      <View>
        <Text style={[ styles.sectionTitle, styles.sectionTitleIndents ]}>
          {this.props.t('creditCardTitle')}
        </Text>
        {bookingStore.userCreditCards.map(item =>
          this.renderCreditCardItem(item)
        )}
        <TouchableOpacity
          onPress={this.scanCreditCard}
          activeOpacity={values.BTN_OPACITY_DEFAULT}
          style={[ styles.actionBtnDark, styles.scanCardBtn ]}
        >
          <Text style={styles.actionBtnDarkLabel}>
            {this.props.t('scanCreditCardBtn')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderLoyaltyBlock = () => {
    return bookingStore.editableOrderRef ? null : (
      <View>
        <Text style={[ styles.sectionTitle, styles.sectionTitleIndents ]}>
          {this.props.t(
            bookingStore.editableOrderRef
              ? 'loyalityProgramEditTitle'
              : 'loyalityProgramTitle'
          )}
        </Text>
        <UFOTextInput
          containerStyle={styles.screenHorizIndents}
          wrapperStyle={[
            styles.voucherInput,
            styles.blockShadow,
            Platform.OS === 'android' && styles.blockShadowAndroidFix
          ]}
          placeholder={this.props.t('voucherPlaceholder')}
          autoCapitalize="characters"
          onChangeText={this.handleInputVoucher}
          defaultValye={bookingStore.voucherCode}
          invalidStatus={!!this.voucherInvalidError}
          successStatus={!!bookingStore.voucherCode && !this.voucherInvalidError}
          alertMessage={this.voucherInvalidError}
        />
        {this.renderLoyaltyCode()}
      </View>
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
          style={[
            styles.creditCardItem,
            isActive && styles.selectedCreditCardItem
          ]}
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
            <Text style={styles.creditCardType}>{data.brand}</Text>
          </View>
        </UFOGradientView>
      </TouchableOpacity>
    );
  };

  renderLoyaltyCode = () => {
    const isActive = bookingStore.allowReferralAmountUse;

    return !bookingStore.loyaltyProgramInfo ? null : (
      <TouchableOpacity
        style={[
          styles.actionBtnDark,
          styles.loyalityBtn,
          !isActive && { opacity: 0.85 }
        ]}
        onPress={isActive ? bookingStore.switchReferralUsing : null}
        activeOpacity={isActive ? values.BTN_OPACITY_DEFAULT : 0.85}
      >
        <TouchableOpacity onPress={this.onPressReferralGuide}>
          <UFOIcon
            name="ios-information-circle-outline"
            style={styles.loyalityTolltipIcon}
          />
        </TouchableOpacity>
        <Text style={styles.actionBtnDarkLabel} numberOfLines={1}>
          {bookingStore.loyaltyProgramInfo}
        </Text>
        {bookingStore.useRefferalAmount && (
          <UFOIcon name="md-checkmark" style={styles.loyalityIcon} />
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
          {bookingStore.newPriceLabel && (
            <Text style={[ styles.infoTitle, styles.infoBlockCarImgIndent ]}>
              {bookingStore.newPriceLabel}
            </Text>
          )}
          <Text style={[ styles.infoText, styles.infoBlockCarImgIndent ]}>
            {`${bookingStore.order.carModel.manufacturer} ${
              bookingStore.order.carModel.name
            }`}
          </Text>
          <Text style={styles.infoText}>
            {bookingStore.order.location.name}
          </Text>
          <Text style={styles.infoText}>
            {bookingStore.bookingDurationLabel}
            {t('common:scheduleFrom')} {bookingStore.rentalScheduleStart}
          </Text>
          <Text style={styles.infoText}>
            {t('common:scheduleTo')} {bookingStore.rentalScheduleEnd}
          </Text>
          {bookingStore.feesPriceLabel && (
            <Text style={[ styles.infoTitleNewPrice, styles.infoNewPriceIndent ]}>
              {bookingStore.feesPriceLabel}
            </Text>
          )}
          {bookingStore.currentPriceLabel && (
            <Text
              style={[
                styles.infoTitleNewPrice,
                !bookingStore.feesPriceLabel && styles.infoNewPriceIndent
              ]}
            >
              {bookingStore.currentPriceLabel}
            </Text>
          )}
          <View style={[ styles.separateLine, styles.separateLineInfoBlock ]} />
          <View style={styles.row}>
            <Text style={styles.infoTitle}>{this.priceDescription}</Text>
            <Text style={styles.infoTitlePrice}>{bookingStore.orderPrice}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.termsLink}
          activeOpacity={values.BTN_OPACITY_DEFAULT}
          onPress={this.openTermsUrl}
        >
          <UFOIcon name="md-open" style={styles.termsLinkIcon} />
          <Text style={styles.termsLinkLabel}>{t('termsLinkLabel')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  get priceDescription() {
    return _.get(
      bookingStore.order,
      'price.description',
      `${this.props.t('totalPricePayment')} : `
    );
  }

  /*
   * Launch camera to credit card, then handle card with stripe and locally save it into card list
   */
  scanCreditCard = async () => {
    try {
      this.isPending = true;
      const hasPermit = await checkAndRequestCameraPermission();
      const options = { ...this.CARDIO_SCAN_OPTIONS, noCamera: !hasPermit };
      const cardIoData = await CardIOModule.scanCard(options);
      const cardStripeObj = await stripe.createTokenWithCard({
        number: cardIoData.cardNumber,
        expMonth: cardIoData.expiryMonth,
        expYear: cardIoData.expiryYear,
        cvc: cardIoData.cvv
      });
      bookingStore.addCreditCardToList({
        ...cardStripeObj,
        imageUrl: CREDIT_CARD_DEFAULT_IMG
      });
    } catch (error) {
      console.log('CARDIO ERROR:', error);
    } finally {
      this.isPending = false;
    }
  };

  /*
   * Apply voucher code, receive new order object into bookingStore
   */
  validateAndApplyVoucher = async code => {
    this.voucherInvalidError = code ? await bookingStore.validateVoucher(code) : '';

    if (code && !this.voucherInvalidError) {
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
   * To FAQ screen
   */
  navToFaq = () => {
    this.props.navigation.navigate(screenKeys.Support);
  };

  /*
   * Confirm agreements before payment for booking
   */
  confirmAgreements = async () => {
    if (!this.agreementConfirmed) {
      const confirmAction = () => {
        this.agreementConfirmed = true;
      };
      await confirm(
        null,
        this.props.t(
          bookingStore.editableOrderRef
            ? 'updateConfirmation'
            : 'ageConfirmation'
        ),
        confirmAction,
        this.openTermsUrl,
        { neutral: this.props.t('termsAlertBtn') }
      );
    }
  };

  /*
   * Handle payment and go to next step
   */
  handleToNextStep = async () => {
    await this.confirmAgreements();

    if (!this.agreementConfirmed) {
      return;
    }

    await bookingStore.confirmBooking();

    if (bookingStore.bookingConfirmation) {
      await driveStore.reset();
      this.props.navigation.replace(screenKeys.BookingStepDrive);
    } else {
      /* if confirmation failed - remove used credit card from list */
      bookingStore.removeCreditCardFromList(bookingStore.currentCreditCardRef, true);
    }
  };

  /*
   * Open external url with terms
   */
  openTermsUrl = () => {
    Linking.openURL(this.props.t('common:termsUrl'));
  };

  /*
   * Open order price description
   */
  openPriceInfo = () => {
    const ref = _.get(
      bookingStore,
      `order.${
        bookingStore.editableOrderRef ? 'newPrice' : 'price'
      }.pricingReference`
    );

    if (ref) {
      bookingStore.priceInfoRef = ref;
      this.props.navigation.navigate(screenKeys.BookingDetails);
    }
  };

  /*
   * Propose to open info in browser
   */
  onPressReferralGuide = async () => {
    const t = this.props.t;
    const infoUrl = this.props.t('common:referralGuideLink');

    await confirm(
      null,
      `${t('readMoreByLink')}\n${infoUrl}`,
      () => Linking.openURL(infoUrl),
      null,
      {
        confirm: t('common:openBtn'),
        cancel: t('common:cancelBtn')
      }
    );
  };
}

export default translate('booking')(StepPayScreen);
