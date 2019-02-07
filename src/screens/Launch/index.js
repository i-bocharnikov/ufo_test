import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import SplashController from 'react-native-splash-screen';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import { keys as screenKeys } from './../../navigators/helpers';
import appStore from './../../stores/appStore';
import registerStore from './../../stores/registerStore';
import { driveStore } from './../../stores';
import { UFOContainer, UFOImage } from './../../components/common';
import UFOSlider from './../../components/UFOSlider';
import styles from './styles';
import { images, values, videos } from './../../utils/theme';

const SCREEN_WIDTH = Dimensions.get('screen').width;

@observer
class LaunchScreen extends Component {
  constructor(props) {
    super(props);
    this.slidesData = [
      {
        title: props.t('slideOneTitle'),
        subTitle: props.t('slideOneSubTitle'),
        text: props.t('slideOneDescription'),
        showSkipBtn: true,
        showNextBtn: false,
        image: null,
        video: null
      },
      {
        title: props.t('slideTwoTitle'),
        subTitle: props.t('slideTwoSubTitle'),
        text: props.t('slideTwoDescription'),
        showSkipBtn: true,
        showNextBtn: false,
        image: null,
        video: videos.test_portrait
      },
      {
        title: props.t('slideThreeTitle'),
        subTitle: props.t('slideThreeSubTitle'),
        text: props.t('slideThreeDescription'),
        showSkipBtn: false,
        showNextBtn: true,
        image: null,
        video: videos.test_portraitHD
      }
    ];
    this.state = { activeSlideIndex: 0 };
    this.screenOpacity = new Animated.Value(1);
    this.animationDuration = 360;
  }

  async componentDidMount() {
    SplashController.hide();
    await appStore.initialise();

    if (registerStore.isUserRegistered && driveStore.hasRentals) {
      this.navToApp();
    }
  }

  render() {
    const bgImage = appStore.isAppReady
      ? ( this.slidesData[this.state.activeSlideIndex].image || images.BG_HOME002 )
      : null;
    const bgVideo = appStore.isAppReady
      ? this.slidesData[this.state.activeSlideIndex].video
      : null;

    return (
      <Animated.View style={[ styles.screenWraper, {opacity: this.screenOpacity} ]}>
        <UFOContainer
          style={styles.container}
          image={bgImage}
          video={bgVideo}
        >
          {appStore.isAppReady && this.renderSlider()}
        </UFOContainer>
      </Animated.View>
    );
  }

  renderSlider = () => {
    const { showSkipBtn, showNextBtn } = this.slidesData[this.state.activeSlideIndex];

    return (
      <View style={styles.sliderWrapper}>
        <UFOImage source={images.ufoLogoTiny} style={styles.logoSmallImg} />
        <UFOSlider
          firstItem={this.state.activeSlideIndex}
          data={this.slidesData}
          renderItem={this.renderSlide}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH}
          inactiveSlideScale={1}
          onSnapToItem={this.onSnapToItem}
        />
        {showSkipBtn && (
          <TouchableOpacity
            onPress={this.navToApp}
            activeOpacity={values.BTN_OPACITY_DEFAULT}
            style={styles.skipBtn}
          >
            <Text style={styles.skipBtnLabel}>{this.props.t('skipBtn')}</Text>
          </TouchableOpacity>
        )}
        {!showNextBtn && (
          <View style={styles.sliderIndicator}>
            {this.slidesData.map((item, i) => (
              <View
                key={`dot-${i}`}
                style={[
                  styles.sliderDot,
                  i === this.state.activeSlideIndex && styles.sliderActiveDot
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  renderSlide = ({ item }) => {
    return (
      <View style={styles.slideTextBlock}>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideSubTitle}>{item.subTitle}</Text>
        <Text style={styles.slideText}>{item.text}</Text>
        {item.showNextBtn && (
          <TouchableOpacity
            onPress={this.navToApp}
            activeOpacity={values.BTN_OPACITY_DEFAULT}
            style={styles.nextBtn}
          >
            <Text style={styles.nextBtnLabel}>{this.props.t('nextBtn')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  onSnapToItem = i => {
    /* to have smooth transition between slides - hide screen with background at switching */
    const showSlider = () => {
      Animated.timing(
        this.screenOpacity,
        {
          toValue: 1,
          duration: this.animationDuration,
          easing: Easing.linear
        }
      ).start();
    };

    Animated.timing(
      this.screenOpacity,
      {
        toValue: 0,
        duration: this.animationDuration,
        easing: Easing.linear
      }
    ).start(() => {
      this.setState({ activeSlideIndex: i }, showSlider);
    });
  };

  navToApp = () => {
    this.props.navigation.navigate(screenKeys.App);
  };
}

export default translate('launch')(LaunchScreen);
