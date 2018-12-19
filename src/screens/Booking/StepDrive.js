import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { bookingStore } from './../../stores';
import { feedbackStore } from './../../stores';
import { keys as screenKeys } from './../../navigators/helpers';
import { UFOContainer, UFOImage } from './../../components/common';
import styles from './styles/drive';
import { images } from './../../utils/theme';

// temp
const TEMP_BG = 'https://resources.ufodrive.com/images/backgrounds/BACKGROUND_WEB_4.jpg';

@observer
class StepDriveScreen extends Component {
  async componentDidMount() {
    await feedbackStore.getReserveFeedbackData();
  }

  render() {
    const feedback = feedbackStore.reserveFeedBack;
    const { t } = this.props;

    return (
      <UFOContainer
        // temp
        image={this.backgroundImage || { uri: TEMP_BG }}
        style={styles.screenContainer}
      >
        <UFOImage
          style={styles.moonImg}
          source={images.moonLand}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>
          {t('driveTitle')}
        </Text>
        <Text style={styles.headerSubTitle}>
          {t('driveSubTitle')}
        </Text>
      </UFOContainer>
    );
  }

  get backgroundImage() {
    const uri = _.get(bookingStore, 'bookingConfirmation.confirmationBackgroundImageUrl');
    return /^(https?:\/\/)/.test(uri) ? { uri } : null;
  }

  navBack = () => {
    this.props.navigation.goBack();
  };
}

export default translate('booking')(StepDriveScreen);
