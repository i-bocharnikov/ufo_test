import React, { Component, Fragment } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { MarkdownView } from 'react-native-markdown-view';

import { bookingStore } from './../../stores';
import UFONavBarWrapper from './../../components/header/UFONavBarWrapper';
import UFOSlider from './../../components/UFOSlider';
import { UFOContainer, UFOModalLoader, UFOImage, UFOIcon_next } from './../../components/common';
import styles, { markdownStyles } from './styles/details';
import commonStyles from './styles';
import { values, colors } from './../../utils/theme';

const SCREEN_WIDTH = Dimensions.get('screen').width;

@observer
class BookingDetailsScreen extends Component {
  constructor() {
    super();
    this.state = { activeSlide: 0 };
  }

  async componentDidMount() {
    await bookingStore.getDescriptionData();
  }

  render() {
    const data = bookingStore.infoDescription;
    const isSelected = this.isSelected();

    return (
      <UFONavBarWrapper
        backBtnAction={this.navBack}
        title={this.getTitle()}
        subtitle={data.name ? data.name.toUpperCase() : ''}
        backgroundWrapper={colors.BG_INVERT}
      >
        <UFOContainer style={styles.container}>
          <UFOSlider
            data={data.descriptionImageUrls}
            renderItem={this.renderSlide}
            itemWidth={SCREEN_WIDTH}
            inactiveSlideScale={1}
            onSnapToItem={this.onSnapToItem}
            loop={true}
            autoplay={true}
            lockScrollWhileSnapping={true}
          />
          <View style={styles.sliderPagination}>
            {data.descriptionImageUrls && data.descriptionImageUrls.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.sliderDot,
                  this.state.activeSlide === index && styles.sliderDotActive
                ]}
              />
            ))}
          </View>
          <View style={styles.separateLine} />
          <Text style={[ styles.commonText, styles.descriptionTitle ]}>
            {data.descriptionHeader}
          </Text>
          <Text style={[ styles.commonBoldText, styles.descriptionSubTitle ]}>
            {data.descriptionSubHeader}
          </Text>
          <View style={styles.descriptionBody}>
            <MarkdownView
              styles={markdownStyles}
              onLinkPress={this.onLinkPress}
            >
              {data.descriptionBody}
            </MarkdownView>
          </View>
          {this.getFuturesBlock()}
          {data.message && (
            <Text style={styles.priceMessage}>
              {data.message}
            </Text>
          )}
          <TouchableOpacity
            onPress={this.handleSelect}
            activeOpacity={values.BTN_OPACITY_DEFAULT}
            style={[ commonStyles.actionBtn, styles.selectBtn ]}
          >
            <UFOIcon_next
              name={isSelected ? 'md-close' : 'md-checkmark'}
              style={styles.selectbtnIcon}
            />
            <Text style={commonStyles.actionBtnLabel}>
              {this.props.t(isSelected ? 'booking:unseclectInfoBtn' : 'booking:seclectInfoBtn')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.navBack}
            activeOpacity={values.BTN_OPACITY_DEFAULT}
            style={styles.closeBtn}
          >
            <Text style={styles.closeBtnLabel}>
              {this.props.t('common:close')}
            </Text>
          </TouchableOpacity>
          <UFOModalLoader isVisible={bookingStore.isLoading} />
        </UFOContainer>
      </UFONavBarWrapper>
    );
  }

  getTitle = () => {
    if (bookingStore.infoDescription.isLocation) {
      return this.props.t('booking:locationInfoTitle');
    }

    if (bookingStore.infoDescription.isCar) {
      return this.props.t('booking:carInfoTitle');
    }

    return '';
  };

  renderSlide = ({ item, index }) => {
    return (
      <View style={styles.slideWrapper}>
        <UFOImage
          source={{ uri: item }}
          style={styles.slideImg}
          resizeMode="contain"
        />
      </View>
    );
  };

  onLinkPress = url => {
    Linking.openURL(url);
  };

  onSnapToItem = i => this.setState({ activeSlide: i });

  getFuturesBlock = () => {
    const { t } = this.props;
    const data = bookingStore.infoDescription;

    if (data.isLocation) {
      return (
        <Fragment>
          <View style={styles.separateLine} />
          <View style={styles.descriptionFeatures}>
            <Text style={styles.commonText}>
              {`${t('booking:address')}: `}
            </Text>
            <Text style={styles.commonBoldText}>
              {data.address}
            </Text>
          </View>
          <View style={styles.separateLine} />
        </Fragment>
      );
    }

    if (data.isCar) {
      return (
        <Fragment>
          <View style={styles.separateLine} />
          <View style={styles.descriptionFeatures}>
            <Text style={styles.commonText}>
              {`${t('booking:infoRange')}: `}
            </Text>
            <Text style={styles.commonBoldText}>
              {data.range} km
            </Text>
            <View style={styles.verticalSeparator} />
            <Text style={styles.commonText}>
              {`${t('booking:infoPeople')}: `}
            </Text>
            <Text style={styles.commonBoldText}>
              {data.maxNumberOfPeople}
            </Text>
          </View>
          <View style={styles.separateLine} />
        </Fragment>
      );
    }

    return null;
  };

  isSelected = () => {
    if (bookingStore.infoDescription.isLocation) {
      return bookingStore.locationInfoRef === bookingStore.selectedLocationRef;
    }

    if (bookingStore.infoDescription.isCar) {
      return bookingStore.carInfoRef === bookingStore.selectedCarRef;
    }

    return false;
  };

  handleSelect = () => {
    if (bookingStore.infoDescription.isLocation && bookingStore.locationInfoRef) {
      bookingStore.selectLocation(bookingStore.locationInfoRef);
    }

    if (bookingStore.infoDescription.isCar && bookingStore.carInfoRef) {
      bookingStore.selectCar(bookingStore.carInfoRef);
    }
  };

  navBack = () => {
    this.props.navigation.goBack();
    bookingStore.carInfoRef = null;
    bookingStore.locationInfoRef = null;
  };
}

export default translate()(BookingDetailsScreen);
