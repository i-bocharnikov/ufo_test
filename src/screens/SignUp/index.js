import React, { Component, Fragment } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { observable } from 'mobx';
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

  @observable email = registerStore.user.email;

  componentDidMount() {
    this.onLoad();
  }

  renderIdCardBlock() {
    const isFilled = Boolean(registerStore.identificationFrontDocument)
      && Boolean(registerStore.identificationBackDocument);

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
      </Fragment>
    ) : (
      <Image
        source={images.photoPicker}
        style={styles.cardPickerImg}
      />
    );
  }

  renderDriverCardBlock() {
    const isFilled = Boolean(registerStore.driverLicenceFrontDocument)
      && Boolean(registerStore.driverLicenceBackDocument);

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
            style={styles.inputBlock}
          />
          <UFOTextInput_re
            placeholder={t('register:emailInputLabel')}
            keyboardType="email-address"
            defaultValue={this.email}
            onChangeText={value => (this.email = value)}
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.inputBlock}
          />
          <UFOTextInput_re
            placeholder="Billing address"
            style={styles.inputBlock}
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
          <Text style={[styles.registrationStatus, styles.topGap]}>
            {registerStore.user.registration_message}
          </Text>
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
  }

  navToIdCardScreen = () => {
    this.props.navigation.navigate(
      screens.REGISTER_IDENTIFICATION.name,
      {
        frontImageUrl: registerStore.identificationFrontDocument,
        backImageUrl: registerStore.identificationBackDocument
      }
    );
  }

  navToDriverCardScreen = () => {
    this.props.navigation.navigate(
      screens.REGISTER_DRIVER_LICENCE.name,
      {
        frontImageUrl: registerStore.driverLicenceFrontDocument,
        backImageUrl: registerStore.driverLicenceBackDocument
      }
    );
  }

  onLoad = async () => {
    /* previous functionality */
    /* handle id card front */
    registerStore.user.identificationFrontDocument = 'loading';

    if (registerStore.user.identification_scan_front_side) {
      registerStore.identificationFrontDocument = 'data:image/png;base64,' + (await registerStore.downloadDocument(registerStore.user.identification_scan_front_side.reference));

    } else {
      registerStore.identificationFrontDocument = null;
    }

    /* handle id card back */
    registerStore.user.identificationBackDocument = 'loading';

    if (registerStore.user.identification_scan_back_side) {
      registerStore.identificationBackDocument = 'data:image/png;base64,' + (await registerStore.downloadDocument(registerStore.user.identification_scan_back_side.reference));

    } else {
      registerStore.identificationBackDocument = null;
    }

    /* handle drive card front */
    registerStore.user.driverLicenceFrontDocument = 'loading';

    if (registerStore.user.driver_licence_scan_front_side) {
      registerStore.driverLicenceFrontDocument = 'data:image/png;base64,' + (await registerStore.downloadDocument(registerStore.user.driver_licence_scan_front_side.reference));

    } else {
      registerStore.driverLicenceFrontDocument = null;
    }

    /* handle drive card back */
    registerStore.user.driverLicenceBackDocument = 'loading';

    if (registerStore.user.driver_licence_scan_back_side) {
      registerStore.driverLicenceBackDocument = 'data:image/png;base64,' + (await registerStore.downloadDocument(registerStore.user.driver_licence_scan_back_side.reference));

    } else {
      registerStore.driverLicenceBackDocument = null;
    }
  }
}

export default translate('translations')(SignUpScreen);

/*
  didn't replace (refactor) in render:
  UFOHeader
  UFOActionBar
  UFOImage
*/
