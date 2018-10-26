import React, { Component, Fragment } from 'react';
import { View, Text, Image, TouchableOpacity, Share, Platform } from 'react-native';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import _ from 'lodash';

import registerStore from './../../stores/registerStore';
import appStore from './../../stores/appStore';
import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import {
  UFOContainer_re,
  UFOTextInput_re,
  UFOImage,
  UFOIcon
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
  componentDidMount() {
    this.initLoad();
  }

  renderIcon(extraStyles) {
    return (
      <UFOIcon
        icon={icons.VALIDATE}
        style={[styles.inputIcon, extraStyles]}
      />
    );
  }

  renderIdCardBlock() {
    const isFilled = registerStore.identificationFrontDocument && registerStore.identificationBackDocument;

    return isFilled ? (
      <Fragment>
        <UFOImage
          source={{uri: registerStore.identificationFrontDocument}}
          style={styles.cardThumb}
        />
        <UFOImage
          source={{uri: registerStore.identificationBackDocument}}
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
          source={{uri: registerStore.driverLicenceFrontDocument}}
          style={styles.cardThumb}
        />
        <UFOImage
          source={{uri: registerStore.driverLicenceBackDocument}}
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
    const hasPhone = Boolean(registerStore.user.phone_number);
    const hasEmail = Boolean(registerStore.user.email);
    const hasAddress = Boolean(registerStore.user.address);

    return (
      <UFOContainer_re image={screens.REGISTER_OVERVIEW.backgroundImage}>
        <UFOHeader
          t={t}
          navigation={navigation}
          title={t('register:overviewTitle', {user: registerStore.user})}
          currentScreen={screens.REGISTER_OVERVIEW}
        />
        <View style={styles.bodyWrapper}>
          <UFOTextInput_re
            placeholder={t('register:phoneNumberInputLabel')}
            defaultValue={registerStore.user.phone_number}
            wrapperStyle={styles.inputBlock}
            onPress={this.navToPhoneScreen}
            isCompleted={hasPhone}
            IconComponent={hasPhone ? this.renderIcon() : null}
          />
          <UFOTextInput_re
            placeholder={t('register:emailInputLabel')}
            defaultValue={registerStore.user.email}
            wrapperStyle={styles.inputBlock}
            onPress={this.navToEmailScreen}
            isCompleted={hasEmail}
            IconComponent={hasEmail ? this.renderIcon() : null}
          />
          <UFOTextInput_re
            placeholder={t('register:addressLabel')}
            defaultValue={registerStore.user.address}
            wrapperStyle={styles.inputBlock}
            onPress={this.navToAddressScreen}
            isCompleted={hasAddress}
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
          {hasReferalCode ? (
            <TouchableOpacity
              style={[styles.referalBlock, styles.topGap]}
              onPress={this.shareRefCode}
              activeOpacity={0.8}
            >
              <Text style={styles.referalLabel}>
                {t('register:referalBlock', {code: refCode})}
              </Text>
              <Image
                source={images.shareRef}
                style={styles.referalImg}
              />
            </TouchableOpacity>
          ) : (
            <Text style={[styles.registrationStatus, styles.topGap]}>
              {registerStore.user.registration_message}
            </Text>
          )}
        </View>
        <UFOActionBar actions={this.compileActions()} />
      </UFOContainer_re>
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
        style: actionStyles.ACTIVE,
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
    this.props.navigation.navigate(
      screens.REGISTER_IDENTIFICATION.name,
      {
        frontImageUrl: registerStore.identificationFrontDocument,
        backImageUrl: registerStore.identificationBackDocument
      }
    );
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

  shareRefCode = () => {
    const content = {message: registerStore.user.referral_code || ''};
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
}

export default translate('translations')(SignUpScreen);

/*
  didn't replace (refactor) in render:
  UFOHeader
  UFOActionBar
  UFOImage
*/
