import React, { Component, Fragment } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { bookingStore, feedbackStore, registerStore } from './../../stores';
import { keys as screenKeys } from './../../navigators/helpers';
import { UFOContainer, UFOImage, UFOModalLoader } from './../../components/common';
import styles from './styles/drive';
import { images, colors } from './../../utils/theme';

// temp
const TEMP_BG = 'https://resources.ufodrive.com/images/backgrounds/BACKGROUND_WEB_4.jpg';

@observer
class StepDriveScreen extends Component {
  async componentDidMount() {
    await feedbackStore.getReserveFeedbackData();
  }

  async componentWillUnmount() {
    await bookingStore.resetStore();
  }

  render() {
    const feedback = feedbackStore.reserveFeedBack;
    const { t } = this.props;

    return (
      <UFOContainer
        // temp
        image={this.backgroundImage || { uri: TEMP_BG }}
        style={styles.container}
      >
        <UFOImage
          style={styles.moonImg}
          source={images.moonLand}
          resizeMode="contain"
        />
        {this.renderMainContent()}
        <UFOModalLoader isVisible={feedbackStore.isLoading} />
      </UFOContainer>
    );
  }

  get backgroundImage() {
    const uri = _.get(bookingStore, 'bookingConfirmation.confirmationBackgroundImageUrl');
    return /^(https?:\/\/)/.test(uri) ? { uri } : null;
  }

  renderMainContent = () => {
    const isRegistered = registerStore.isUserRegistered;
    const t = this.props.t;

    return (
      <Fragment>
        <Text style={[ styles.headerTitle, styles.textShadow ]}>
          {t('driveTitle')}
        </Text>
        <Text style={[ styles.headerSubTitle, styles.textShadow ]}>
          {t('driveSubTitle')}
        </Text>
        <Text style={[ styles.descriptionText, styles.textShadow ]}>
          {t(isRegistered ? 'dreveDescrDriveP1' : 'dreveDescrRegisterP1')}
          <Text style={styles.linkedText} onPress={this.navToGuide}>
            {t('dreveDescrGuideLink')}
          </Text>
        </Text>
        <TouchableHighlight
          onPress={this.navNext}
          underlayColor={colors.BG_DEFAULT}
          style={styles.nextBtn}
        >
          <Text style={styles.nextBtnLabel}>
            {t(isRegistered ? 'driveNextDrive' : 'driveNextRegister')}
          </Text>
        </TouchableHighlight>
      </Fragment>
    );
  };

  navBack = () => {
    this.props.navigation.goBack();
  };

  navNext = () => {
    const { navigation } = this.props;
    navigation.popToTop();

    registerStore.isUserRegistered
      ? navigation.navigate(screenKeys.Drive)
      : navigation.navigate(screenKeys.SignUp);
  };

  navToGuide = () => {
    this.props.navigation.popToTop();
    this.props.navigation.navigate(screenKeys.SupportFaqs);
  };
}

export default translate('booking')(StepDriveScreen);
