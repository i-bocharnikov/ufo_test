import React, { Component, Fragment } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  Image,
  TouchableOpacity,
  Share,
  Platform
} from 'react-native';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';

import screenKeys from './../../navigators/helpers/screenKeys';
import { appStore, registerStore } from './../../stores';
import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import UFOPopover from './../../components/UFOPopover';
import {
  UFOContainer,
  UFOTextInput,
  UFOImage,
  UFOIcon_old
} from './../../components/common';
import { screens, images, actionStyles, icons } from './../../utils/global';
import styles from './styles';

@observer
class SignUpScreen extends Component {
  @observable refreshing = false;

  async componentDidMount() {
    await registerStore.fetchScanDocumentThumbs();

    reaction(
      () => registerStore.isConnected,
      () => registerStore.isConnected && this.refreshSignUpData()
    );
  }

  renderIcon(extraStyles) {
    return (
      <UFOIcon_old
        icon={icons.VALIDATE}
        style={[styles.inputIcon, extraStyles]}
      />
    );
  }

  renderIdCardBlock() {
    const isFilled =
      registerStore.idCardFrontScan &&
      registerStore.idCardBackScan;

    return isFilled ? (
      <Fragment>
        <UFOImage
          source={{ uri: registerStore.idCardFrontScan }}
          style={styles.cardThumb}
        />
        <UFOImage
          source={{ uri: registerStore.idCardBackScan }}
          style={styles.cardThumb}
        />
        {this.renderIcon(styles.cardIcon)}
      </Fragment>
    ) : (
      <Image source={images.photoPicker} style={styles.cardPickerImg} />
    );
  }

  renderDriverCardBlock() {
    const isFilled =
      registerStore.dlCardFrontScan &&
      registerStore.dlCardBackScan;

    return isFilled ? (
      <Fragment>
        <UFOImage
          source={{ uri: registerStore.dlCardFrontScan }}
          style={styles.cardThumb}
        />
        <UFOImage
          source={{ uri: registerStore.dlCardBackScan }}
          style={styles.cardThumb}
        />
        {this.renderIcon(styles.cardIcon)}
      </Fragment>
    ) : (
      <Image source={images.photoPicker} style={styles.cardPickerImg} />
    );
  }

  render() {
    const { t, navigation } = this.props;
    const refCode = registerStore.user.referral_code;
    const hasReferalCode = registerStore.isUserRegistered && Boolean(refCode);
    const hasPhone = registerStore.isCurrentPhoneValid;
    const hasEmail = Boolean(registerStore.user.email);
    const hasAddress = Boolean(registerStore.user.address);
    const hasMiles = Boolean(registerStore.user.miles_and_more);

    return (
      <UFOContainer image={screens.REGISTER_OVERVIEW.backgroundImage}>
        <UFOHeader
          t={t}
          navigation={navigation}
          title={t('register:overviewTitle', { user: registerStore.user })}
          currentScreen={screens.REGISTER_OVERVIEW}
        />
        <ScrollView
          style={styles.scrollWrapper}
          contentContainerStyle={styles.bodyWrapper}
          refreshControl={
            <RefreshControl
              onRefresh={this.refreshSignUpData}
              refreshing={this.refreshing}
            />
          }
        >
          <UFOTextInput
            placeholder={t('register:phoneNumberInputLabel')}
            defaultValue={registerStore.user.phone_number}
            wrapperStyle={styles.inputBlock}
            onPress={this.navToPhoneScreen}
            IconComponent={hasPhone ? this.renderIcon() : null}
          />
          <UFOTextInput
            placeholder={t('register:emailInputLabel')}
            defaultValue={registerStore.user.email}
            wrapperStyle={styles.inputBlock}
            onPress={this.navToEmailScreen}
            IconComponent={hasEmail ? this.renderIcon() : null}
          />
          <UFOTextInput
            placeholder={t('register:addressLabel')}
            defaultValue={registerStore.user.address}
            wrapperStyle={styles.inputBlock}
            onPress={this.navToAddressScreen}
            IconComponent={hasAddress ? this.renderIcon() : null}
          />
          <View style={styles.cardsBlock}>
            <TouchableOpacity
              style={styles.cardWrapper}
              onPress={this.navToIdCardScreen}
              activeOpacity={0.8}
            >
              {this.renderIdCardBlock()}
              <Text style={styles.cardPickerLabel}>
                {t('register:idCardPickerLabel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cardWrapper, styles.leftGap]}
              onPress={this.navToDriverCardScreen}
              activeOpacity={0.8}
            >
              {this.renderDriverCardBlock()}
              <Text style={styles.cardPickerLabel}>
                {t('register:driveCardPickerLabel')}
              </Text>
            </TouchableOpacity>
          </View>
          {hasReferalCode && (
            <TouchableOpacity
              style={[styles.referalBlock, styles.topGap]}
              onPress={this.shareRefCode}
              activeOpacity={0.8}
            >
              <Text style={styles.referalLabel}>
                {t('register:referalBlock', { code: refCode })}
              </Text>
              <Image source={images.shareRef} style={styles.referalImg} />
            </TouchableOpacity>
          )}
          {registerStore.isUserRegistered && (
            <UFOTextInput
              placeholder={t('booking:milesPlaceholder')}
              defaultValue={registerStore.user.miles_and_more}
              wrapperStyle={styles.inputMiles}
              onPress={this.navToMilesScreen}
              IconComponent={hasMiles ? this.renderIcon() : null}
            />
          )}
        </ScrollView>
        <UFOPopover message={registerStore.user.registration_message} />
        <UFOActionBar actions={this.compileActions()} />
      </UFOContainer>
    );
  }

  compileActions = () => {
    const { t, navigation } = this.props;
    const actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.HOME,
        onPress: () => navigation.navigate(screenKeys.Home)
      }
    ];

    if (registerStore.isConnected) {
      actions.push({
        style: actionStyles.ACTIVE,
        icon: icons.LOGOUT,
        onPress: async () => await appStore.disconnect(t)
      });

      actions.push({
        style: registerStore.isConnected
          ? actionStyles.TODO
          : actionStyles.DISABLE,
        icon: icons.DONE,
        onPress: () => navigation.navigate(screenKeys.Home)
      });
    } else {
      actions.push({
        style: registerStore.isCurrentPhoneValid
          ? actionStyles.TODO
          : actionStyles.ACTIVE,
        icon: icons.LOGIN,
        onPress: this.navToPhoneScreen
      });
    }

    return actions;
  };

  navToPhoneScreen = () => {
    this.props.navigation.navigate(screenKeys.Phone);
  };

  navToEmailScreen = () => {
    this.props.navigation.navigate(screenKeys.Email);
  };

  navToAddressScreen = () => {
    this.props.navigation.navigate(screenKeys.Address);
  };

  navToIdCardScreen = () => {
    const { navigation, t } = this.props;
    const params = {
      actionNavNext: () => navigation.navigate(screenKeys.Identification),
      actionNavBack: () => navigation.navigate(screenKeys.SignUp),
      actionHandleFileAsync: registerStore.uploadFaceCapture,
      description: t('faceRecognizing:registerCaptureDescription'),
      autohandling: true
    };
    if (registerStore.user.face_capture_required && !DeviceInfo.isEmulator()) {
      navigation.navigate(screenKeys.FaceRecognizer, params);
    } else {
      this.props.navigation.navigate(screenKeys.Identification);
    }
  };

  navToDriverCardScreen = () => {
    this.props.navigation.navigate(screenKeys.DriverLicence);
  };

  navToMilesScreen = () => {
    this.props.navigation.navigate(screenKeys.Miles);
  };

  shareRefCode = () => {
    const code = registerStore.user.referral_code;
    const message = this.props.t('register:referalCodeMessage', { code });

    const content = { message };
    const options = {};

    if (Platform.OS === 'android') {
      options.dialogTitle = this.props.t('register:shareDialogTitle');
    }

    Share.share(content, options);
  };

  refreshSignUpData = async () => {
    this.refreshing = true;
    await registerStore.getUserData();
    await registerStore.fetchScanDocumentThumbs();
    this.refreshing = false;
  };
}

export default translate()(SignUpScreen);
