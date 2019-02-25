import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { bookingStore, driveStore } from './../../stores';
import { keys as screenKeys } from './../../navigators/helpers';
import { UFOContainer, UFOLoader } from './../../components/common';
import BookingNavWrapper from './components/BookingNavWrapper';
import BottomActionPanel from './components/BottomActionPanel';
import styles from './styles';

@observer
class StepCancellationScreen extends Component {
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
            <Text style={[ styles.infoTitle, styles.infoBlockCarImgIndent ]}>
              {bookingStore.cancellationFeesLabel}
            </Text>
            <Text style={[ styles.infoText, styles.infoBlockCarImgIndent ]}>
              {t('cancelationFees')}
            </Text>
            <Text style={styles.infoTitleNewPrice}>
              {bookingStore.cancellationPriceLabel}
            </Text>
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
    return _.get(bookingStore, 'price.description', `${this.props.t('totalPricePayment')} : `);
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
      screenKeys.SupportFaqs,
      { PREVIOUS_SCREEN: screenKeys.Booking }
    );
  };

  /*
   * Handle payment and go to next step
  */
  handleToNextStep = async () => {
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
