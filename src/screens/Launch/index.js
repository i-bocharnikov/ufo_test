import React, { Component, Fragment } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import SplashController from 'react-native-splash-screen';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import { keys as screenKeys } from './../../navigators/helpers';
import appStore from './../../stores/appStore';
import registerStore from './../../stores/registerStore';
import { UFOContainer, UFOModalLoader, UFOImage } from './../../components/common';
import UFOSlider from './../../components/UFOSlider';
import styles from './styles';
import { images, values } from './../../utils/theme';

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
        showNextBtn: false
      },
      {
        title: props.t('slideTwoTitle'),
        subTitle: props.t('slideTwoSubTitle'),
        text: props.t('slideTwoDescription'),
        showSkipBtn: true,
        showNextBtn: false
      },
      {
        title: props.t('slideThreeTitle'),
        subTitle: props.t('slideThreeSubTitle'),
        text: props.t('slideThreeDescription'),
        showSkipBtn: false,
        showNextBtn: true
      }
    ];
    this.state = { activeSlideIndex: 0 };
  }

  async componentDidMount() {
    SplashController.hide();
    await appStore.initialise(this.props.t);

    if (registerStore.isUserRegistered) {
      this.navToApp();
    }
  }

  render() {
    return (
      <UFOContainer
        style={styles.container}
        image={images.BG_HOME002}
      >
        {!appStore.isAppReady
          ? this.renderPreloadingBlock()
          : this.renderSlider()
        }
        <UFOModalLoader isVisible={!appStore.isAppReady} />
      </UFOContainer>
    );
  }

  renderPreloadingBlock = () => {
    return (
      <Fragment>
        <UFOImage
          source={images.ufoLogoBig}
          style={styles.logoBigImg}
        />
        <Text style={styles.launchTitle}>
          {this.props.t('launchTitle')}
        </Text>
      </Fragment>
    );
  };

  renderSlider = () => {
    const { showSkipBtn, showNextBtn } = this.slidesData[this.state.activeSlideIndex];

    return (
      <View style={styles.sliderWrapper}>
        <UFOImage
          source={images.ufoLogoTiny}
          style={styles.logoSmallImg}
        />
        <UFOSlider
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
            <Text style={styles.skipBtnLabel}>
              {this.props.t('skipBtn')}
            </Text>
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
        <Text style={styles.slideTitle}>
          {item.title}
        </Text>
        <Text style={styles.slideSubTitle}>
          {item.subTitle}
        </Text>
        <Text style={styles.slideText}>
          {item.text}
        </Text>
        {item.showNextBtn && (
          <TouchableOpacity
            onPress={this.navToApp}
            activeOpacity={values.BTN_OPACITY_DEFAULT}
            style={styles.nextBtn}
          >
            <Text style={styles.nextBtnLabel}>
              {this.props.t('nextBtn')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  onSnapToItem = i => this.setState({ activeSlideIndex: i });

  navToApp = () => {
    this.props.navigation.navigate(screenKeys.App);
  };
}

export default translate('launch')(LaunchScreen);
