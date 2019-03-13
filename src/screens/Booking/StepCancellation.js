import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { bookingStore, driveStore } from './../../stores';
import screenKeys from './../../navigators/helpers/screenKeys';
import { UFOContainer, UFOLoader } from './../../components/common';
import BookingNavWrapper from './components/BookingNavWrapper';
import BottomActionPanel from './components/BottomActionPanel';
import { confirm } from './../../utils/interaction';
import styles from './styles';

@observer
class StepCancellationScreen extends Component {
  agreementConfirmed = false;

  render() {
    const { t } = this.props;

    return (
      <BookingNavWrapper
        navBack={this.navBack}
        navToFaq={this.navToFaq}
        navToFirstStep={this.navBack}
        currentStep={2}
        isEditing={!!bookingStore.editableOrderRef}
        isCancellation={true}
        BottomActionPanel={this.renderBottomPanel()}
      >
        <UFOContainer style={styles.screenCancelContainer}>
          <Text style={[ styles.sectionTitle, styles.sectionTitleIndents ]}>
            {t('infoAtPaymentTitle')}
          </Text>
          <View style={[ styles.infoBlock, styles.blockShadow ]}>
            {bookingStore.feesPriceLabel && (
              <Text style={[ styles.infoTitle, styles.infoBlockCarImgIndent ]}>
                {bookingStore.feesPriceLabel}
              </Text>
            )}
            <Text style={[ styles.infoText, styles.infoBlockCarImgIndent ]}>
              {t('cancelationFees')}
            </Text>
            {bookingStore.currentPriceLabel && (
              <Text style={[ styles.infoTitleNewPrice, styles.infoNewPriceIndent ]}>
                {bookingStore.currentPriceLabel}
              </Text>
            )}
            <View style={[ styles.separateLine, styles.separateLineInfoBlock ]} />
            <View style={styles.row}>
              <Text style={styles.infoTitle}>
                {this.priceDescription}
              </Text>
              <Text style={styles.infoTitlePrice}>
                {bookingStore.orderPrice}
              </Text>
            </View>
          </View>
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
      isAvailable={true}
      isWaiting={bookingStore.isLoading}
      openPriceInfo={this.openPriceInfo}
    />
  );

  get priceDescription() {
    return _.get(bookingStore.order, 'price.description', `${this.props.t('totalPricePayment')} : `);
  }

  /*
   * To previous screen
  */
  navBack = () => {
    bookingStore.isCancellation = false;
    this.props.navigation.goBack();
  };

  /*
   * To FAQ screen
  */
  navToFaq = () => {
    this.props.navigation.navigate(
      screenKeys.Support,
      { PREVIOUS_SCREEN: screenKeys.Booking }
    );
  };

  /*
   * Confirm cancellation
  */
  confirmAgreements = async () => {
    if (!this.agreementConfirmed) {
      await confirm(
        null,
        this.props.t('ageConfirmation'),
        () => { this.agreementConfirmed = true; }
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

    await bookingStore.confirmCancellation();

    if (bookingStore.bookingConfirmation) {
      await driveStore.reset();
      this.props.navigation.replace(screenKeys.BookingStepDrive);
    }
  };

  /*
   * Open order price description
  */
  openPriceInfo = () => {
    const ref = _.get(
      bookingStore,
      `order.${bookingStore.editableOrderRef ? 'newPrice' : 'price'}.pricingReference`
    );

    if (ref) {
      bookingStore.priceInfoRef = ref;
      this.props.navigation.navigate(screenKeys.BookingDetails);
    }
  };
}

export default translate('booking')(StepCancellationScreen);
