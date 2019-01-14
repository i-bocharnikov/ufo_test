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

import { keys as screenKeys } from './../../navigators/helpers';
import registerStore from './../../stores/registerStore';
import appStore from './../../stores/appStore';
import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import UFOPopover from './../../components/UFOPopover';
import {
  UFOContainer,
  UFOTextInput,
  UFOImage,
  UFOIcon_old
} from './../../components/common';
import {
  screens,
  images,
  actionStyles,
  icons
} from './../../utils/global';
import styles from './styles';

@observer
class SignUpScreen extends Component {

  @observable refreshing = false;

  async componentDidMount() {
    await this.initLoad();

    reaction(
      () => registerStore.isConnected,
      () => registerStore.isConnected && this.refreshSignUpData()
    );
  }

  renderIcon(extraStyles) {
    return (
      <UFOIcon_old
        icon={icons.VALIDATE}
        style={[ styles.inputIcon, extraStyles ]}
      />
    );
  }

  renderIdCardBlock() {
    const isFilled = registerStore.identificationFrontDocument && registerStore.identificationBackDocument;

    return isFilled ? (
      <Fragment>
        <UFOImage
          source={{ uri: registerStore.identificationFrontDocument }}
          style={styles.cardThumb}
        />
        <UFOImage
          source={{ uri: registerStore.identificationBackDocument }}
          style={styles.cardThumb}
        />
        {this.renderIcon(styles.cardIcon)}
      </Fragment>
    ) : (
      <Image
        source={images.photoPicker}
        style={styles.cardPickerImg}
      />
    );
  }

  renderDriverCardBlock() {
    const isFilled = registerStore.driverLicenceFrontDocument
      && registerStore.driverLicenceBackDocument;

    return isFilled ? (
      <Fragment>
        <UFOImage
          source={{ uri: registerStore.driverLicenceFrontDocument }}
          style={styles.cardThumb}
        />
        <UFOImage
          source={{ uri: registerStore.driverLicenceBackDocument }}
          style={styles.cardThumb}
        />
        {this.renderIcon(styles.cardIcon)}
      </Fragment>
    ) : (
      <Image
        source={images.photoPicker}
        style={styles.cardPickerImg}
      />
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
              style={[ styles.cardWrapper, styles.leftGap ]}
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
              style={[ styles.referalBlock, styles.topGap ]}
              onPress={this.shareRefCode}
              activeOpacity={0.8}
            >
              <Text style={styles.referalLabel}>
                {t('register:referalBlock', { code: refCode })}
              </Text>
              <Image
                source={images.shareRef}
                style={styles.referalImg}
              />
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
        onPress: () => navigation.navigate(screens.HOME.name)
      }
    ];

    if (registerStore.isConnected) {
      actions.push({
        style: actionStyles.ACTIVE,
        icon: icons.LOGOUT,
        onPress: async () => await appStore.disconnect(t)
      });

      actions.push({
        style: registerStore.isConnected ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.DONE,
        onPress: () => navigation.navigate(screens.HOME.name)
      });

    } else {
      actions.push({
        style: registerStore.isCurrentPhoneValid ? actionStyles.TODO : actionStyles.ACTIVE,
        icon: icons.LOGIN,
        onPress: async () => navigation.navigate(screens.REGISTER_PHONE.name)
      });
    }

    return actions;
  };

  navToPhoneScreen = () => {
    this.props.navigation.navigate(screens.REGISTER_PHONE.name);
  };

  navToEmailScreen = () => {
    this.props.navigation.navigate(screens.REGISTER_EMAIL.name);
  };

  navToAddressScreen = () => {
    this.props.navigation.navigate(screens.REGISTER_ADDRESS.name);
  };

  navToIdCardScreen = () => {
    const { navigation } = this.props;
    const params = {
      actionNavNext: () => navigation.navigate(screenKeys.Identification),
      actionNavBack: () => navigation.navigate(screenKeys.SignUp),
      actionHandleFileAsync: this.uploadFaceCapture
    };

    navigation.navigate(screenKeys.FaceRecognizer, params);
  };

  navToDriverCardScreen = () => {
    this.props.navigation.navigate(
      screens.REGISTER_DRIVER_LICENCE.name,
      {
        frontImageUrl: registerStore.driverLicenceFrontDocument,
        backImageUrl: registerStore.driverLicenceBackDocument
      }
    );
  };

  navToMilesScreen = () => {
    this.props.navigation.navigate(screens.REGISTER_MILES.name);
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

  initLoad = async () => {
    /* handle id card front */
    registerStore.user.identificationFrontDocument = 'loading';
    if (registerStore.user.identification_scan_front_side) {

      const imgRef = registerStore.user.identification_scan_front_side.reference;
      const imgData = await registerStore.downloadDocument(imgRef);
      registerStore.identificationFrontDocument = imgData
        ? `data:image/png;base64,${imgData}`
        : null;

    } else {
      registerStore.identificationFrontDocument = null;
    }

    /* handle id card back */
    registerStore.user.identificationBackDocument = 'loading';
    if (registerStore.user.identification_scan_back_side) {

      const imgRef = registerStore.user.identification_scan_back_side.reference;
      const imgData = await registerStore.downloadDocument(imgRef);
      registerStore.identificationBackDocument = imgData
        ? `data:image/png;base64,${imgData}`
        : null;

    } else {
      registerStore.identificationBackDocument = null;
    }

    /* handle drive card front */
    registerStore.user.driverLicenceFrontDocument = 'loading';
    if (registerStore.user.driver_licence_scan_front_side) {
      const imgRef = registerStore.user.driver_licence_scan_front_side.reference;
      const imgData = await registerStore.downloadDocument(imgRef);
      registerStore.driverLicenceFrontDocument = imgData
        ? `data:image/png;base64,${imgData}`
        : null;

    } else {
      registerStore.driverLicenceFrontDocument = null;
    }

    /* handle drive card back */
    registerStore.user.driverLicenceBackDocument = 'loading';
    if (registerStore.user.driver_licence_scan_back_side) {
      const imgRef = registerStore.user.driver_licence_scan_back_side.reference;
      const imgData = await registerStore.downloadDocument(imgRef);
      registerStore.driverLicenceBackDocument = imgData
        ? `data:image/png;base64,${imgData}`
        : null;

    } else {
      registerStore.driverLicenceBackDocument = null;
    }
  };

  refreshSignUpData = async () => {
    this.refreshing = true;
    await registerStore.getUserData();
    await this.initLoad();
    this.refreshing = false;
  };

  uploadFaceCapture = async fileUri => {
    const uploadedData = await registerStore.uploadDocument(
      'identification',
      'one_side',
      'face_capture',
      'front_side',
      fileUri
    );
console.log('DOCUMENT DATA', uploadedData);
    registerStore.user.identification_face_capture_reference = uploadedData.reference;
    const responce = await registerStore.save();
console.log('UPDATE USER', responce);
    return true;
  };
}

export default translate('translations')(SignUpScreen);

/*
  didn't replace (refactor) in render:
  UFOHeader
  UFOActionBar
  UFOImage
*/
