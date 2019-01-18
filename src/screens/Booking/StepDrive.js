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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { bookingStore, feedbackStore } from './../../stores';
import registerStore from './../../stores/registerStore';
import { keys as screenKeys } from './../../navigators/helpers';
import {
  UFOContainer,
  UFOImage,
  UFOLoader,
  UFOCheckBoxItem,
  UFOTextInput
} from './../../components/common';
import styles from './styles/drive';
import { images, colors } from './../../utils/theme';

@observer
class StepDriveScreen extends Component {
  constructor() {
    super();
    this.state = {
      showFeedBackDialog: true,
      additionalInputRef: null
    };
  }

  async componentDidMount() {
    await feedbackStore.getReserveFeedbackData();
  }

  async componentWillUnmount() {
    await bookingStore.resetStore();
  }

  render() {
    return (
      <UFOContainer
        image={this.backgroundImage}
        style={styles.container}
      >
        <View style={styles.driveBgShadow} />
        <UFOImage
          style={styles.moonImg}
          source={images.moonLand}
          resizeMode="contain"
        />
        {this.renderMainContent()}
        {this.renderFeedBackDialog()}
        <UFOLoader isVisible={feedbackStore.isLoading} isModal={false} />
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

    const additionalInputRef = this.state.additionalInputRef;
    const showConfirmBtn = additionalInputRef
      || feedback.multiSelectionAllowed && _.find(feedback.choices, [ 'value', true ]);

    return (
      <Modal
        transparent={true}
        visible={true}
        onRequestClose={() => null}
      >
        <KeyboardAwareScrollView
          style={styles.dialogScrollWrapper}
          contentContainerStyle={styles.dialogWrapper}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>
              {this.props.t('feedBackTitle')}
            </Text>
            <Text style={styles.dialogQuestion}>
              {feedback.question}
            </Text>
            {feedback.choices.map(item => item.reference === additionalInputRef
              ? this.renderAdditionalInput()
              : (
              <UFOCheckBoxItem
                key={item.reference}
                label={_.isString(item.value) ? item.value : item.text}
                isChecked={!!item.value}
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
        </KeyboardAwareScrollView>
      </Modal>
    );
  };

  renderAdditionalInput = () => {
    return (
      <UFOTextInput
        key="feedbackInput"
        placeholder={this.props.t('feedBackInputPlaceholder')}
        onChangeText={this.handleInputAnswer}
        autoFocus={true}
      />
    );
  };

  /*
   * Handler for pressing on any options
  */
  handleCooseAnswer = choiceRef => {
    const choice = _.find(feedbackStore.reserveFeedBack.choices, [ 'reference', choiceRef ]);
    const sendCallback = () => {
      if (!feedbackStore.reserveFeedBack.multiSelectionAllowed) {
        this.handleSendFeedBack();
      }
    };

    if (choice && choice.type === 'INPUTTEXT') {
      this.setState({ additionalInputRef: choiceRef });
      return;
    }

    feedbackStore.chooseReserveOption(choiceRef);

    if (this.state.additionalInputRef) {
      this.setState({ additionalInputRef: null }, sendCallback);
      return;
    }

    sendCallback();
  };

  /*
   * Handler for input custom option
  */
  handleInputAnswer = value => {
    feedbackStore.inputReserveOption(this.state.additionalInputRef, value);
  };

  /*
   * Send feedback and close modal dialog
  */
  handleSendFeedBack = () => {
    if (this.state.additionalInputRef) {
      /* valifate input value (now only non empty) */
      const choice = _.find(feedbackStore.reserveFeedBack.choices, [ 'reference', this.state.additionalInputRef ]);

      if (!_.isString(choice.value) || !choice.value.length) {
        return;
      }
    }

    this.setState({ showFeedBackDialog: false }, feedbackStore.sendReserveFeedback);
  };

  /*
   * Finish this screen actions and go next
  */
  navNext = () => {
    const { navigation } = this.props;
    navigation.popToTop();

    registerStore.isUserRegistered
      ? navigation.navigate(screenKeys.Drive)
      : navigation.navigate(screenKeys.SignUp);
  };

  /*
   * Navigation to FAQ screen
  */
  navToGuide = () => {
    this.props.navigation.popToTop();
    this.props.navigation.navigate(screenKeys.SupportFaqs);
  };
}

export default translate('booking')(StepDriveScreen);
