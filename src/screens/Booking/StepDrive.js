import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Modal,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { bookingStore, feedbackStore, registerStore } from './../../stores';
import { keys as screenKeys } from './../../navigators/helpers';
import {
  UFOContainer,
  UFOImage,
  UFOModalLoader,
  UFOCheckBoxItem
} from './../../components/common';
import styles from './styles/drive';
import { images, colors } from './../../utils/theme';

// temp
const TEMP_BG = 'https://resources.ufodrive.com/images/backgrounds/BACKGROUND_WEB_4.jpg';

@observer
class StepDriveScreen extends Component {
  constructor() {
    super();
    this.state = { showFeedBackDialog: true };
  }

  async componentDidMount() {
    await feedbackStore.getReserveFeedbackData();
  }

  async componentWillUnmount() {
    await bookingStore.resetStore();
  }

  render() {
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
        {this.renderFeedBackDialog()}
        {<UFOModalLoader isVisible={feedbackStore.isLoading} />}
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

  renderFeedBackDialog = () => {
    const showDialog = this.state.showFeedBackDialog && !feedbackStore.isLoading;
    const feedback = feedbackStore.reserveFeedBack;

    if (!showDialog || !feedback) {
      return null;
    }

    const showConfirmBtn = feedback.multiSelectionAllowed && _.find(feedback.choices, ['value', true]);

    return (
      <Modal
        transparent={true}
        visible={true}
        onRequestClose={() => null}
      >
        <ScrollView
          style={styles.dialogScrollWrapper}
          contentContainerStyle={styles.dialogWrapper}
          bounces={false}
        >
          <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>
              {this.props.t('feedBackTitle')}
            </Text>
            <Text style={styles.dialogQuestion}>
              {feedback.question}
            </Text>
            {feedback.choices.map(item => (
              <UFOCheckBoxItem
                key={item.reference}
                label={item.text}
                isChecked={item.value}
                onCheck={() => this.handleCooseAnswer(item.reference)}
                wrapperStyle={styles.dialogItem}
              />
            ))}
          </View>
          {showConfirmBtn && (
            <TouchableHighlight
              onPress={this.handleSendFeedBack}
              underlayColor={colors.BG_DEFAULT}
              style={styles.dialogBtn}
            >
              <Text style={styles.dialogBtnLabel}>
                {this.props.t('confirmDialog')}
              </Text>
            </TouchableHighlight>
          )}
        </ScrollView>
      </Modal>
    );
  };

  handleCooseAnswer = choiceRef => {
    feedbackStore.chooseOption(choiceRef);

    if (!feedbackStore.reserveFeedBack.multiSelectionAllowed) {
      this.handleSendFeedBack();
    }
  };

  handleSendFeedBack = () => {
    this.setState({showFeedBackDialog: false}, feedbackStore.sendReserveFeedback);
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
