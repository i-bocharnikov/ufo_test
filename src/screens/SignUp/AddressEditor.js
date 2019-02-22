import React, { Component } from 'react';
import { View, LayoutAnimation } from 'react-native';
import { observer } from 'mobx-react';
import { observable, reaction } from 'mobx';
import { translate } from 'react-i18next';
import _ from 'lodash';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DeviceInfo from 'react-native-device-info';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, UFOTextInput } from './../../components/common';
import { keys as screenKeys } from './../../navigators/helpers';
import { screens, actionStyles, icons } from './../../utils/global';
import { registerStore } from './../../stores';
import { GOOGLE_API_KEY } from './../../utils/configurations';
import styles, { googleInputStyles } from './styles';

const REGEX_VAT_VALIDATION = /^((AT)?U[0-9]{8}|(BE)?0[0-9]{9}|(BG)?[0-9]{9,10}|(CY)?[0-9]{8}L|(CZ)?[0-9]{8,10}|(DE)?[0-9]{9}|(DK)?[0-9]{8}|(EE)?[0-9]{9}|(EL|GR)?[0-9]{9}|(ES)?[0-9A-Z][0-9]{7}[0-9A-Z]|(FI)?[0-9]{8}|(FR)?[0-9A-Z]{2}[0-9]{9}|(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})|(HU)?[0-9]{8}|(IE)?[0-9]S[0-9]{5}L|(IT)?[0-9]{11}|(LT)?([0-9]{9}|[0-9]{12})|(LU)?[0-9]{8}|(LV)?[0-9]{11}|(MT)?[0-9]{8}|(NL)?[0-9]{9}B[0-9]{2}|(PL)?[0-9]{10}|(PT)?[0-9]{9}|(RO)?[0-9]{2,10}|(SE)?[0-9]{12}|(SI)?[0-9]{8}|(SK)?[0-9]{10})$/;

@observer
class AddressScreen extends Component {
  @observable addressValue = registerStore.user.address;
  @observable companyValue = registerStore.user.company_name;
  @observable vatValue = registerStore.user.vat_number;
  @observable placesListDisplayed = false;
  @observable isVATValid = true;

  componentDidMount() {
    reaction(
      () => this.placesListDisplayed,
      () => LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.linear, duration: 160 })
    );
  }

  render() {
    const { t, i18n, navigation } = this.props;

    return (
      <UFOContainer image={screens.REGISTER_OVERVIEW.backgroundImage}>
        <UFOHeader
          t={t}
          navigation={navigation}
          title={t('register:addressTitle', { user: registerStore.user })}
          currentScreen={screens.REGISTER_ADDRESS}
        />
          <GooglePlacesAutocomplete
            getDefaultValue={() => registerStore.user.address || ''}
            textInputProps={{
              onChangeText: text => (this.addressValue = text),
              onFocus: () => (this.placesListDisplayed = true),
              onBlur: () => (this.placesListDisplayed = false)
            }}
            onPress={(data, details) => {
              let address = data.description;
              if (details && details.formatted_address) {
                address = details.formatted_address;
              }
              this.addressValue = address;
            }}
            numberOfLines={2}
            enablePoweredByContainer={false}
            placeholder={t('register:addressInputPlaceholder')}
            minLength={4}
            autoFocus={!registerStore.user.address}
            returnKeyType="default"
            fetchDetails={true}
            query={{
              key: GOOGLE_API_KEY,
              language: i18n.language
            }}
            currentLocation={false}
            debounce={200}
            styles={googleInputStyles}
            listViewDisplayed={this.placesListDisplayed}
          />
          <View style={styles.invoiceInputsWrapper}>
            <UFOTextInput
              defaultValue={registerStore.user.company_name}
              placeholder={t('register:companyInputPlaceholder')}
              onChangeText={value => (this.companyValue = value)}
              wrapperStyle={[ styles.inputBlock, styles.topGap ]}
            />
            <UFOTextInput
              defaultValue={registerStore.user.vat_number}
              placeholder={t('register:vatInputPlaceholder')}
              onChangeText={this.handleVATChange}
              autoCapitalize="characters"
              wrapperStyle={styles.inputBlock}
              invalidStatus={!this.isVATValid}
            />
          </View>
        <UFOActionBar actions={this.compileActions()} />
      </UFOContainer>
    );
  }

  compileActions = () => {
    const initRegistration = this.props.navigation.getParam('initRegistration', false);
    const actions = [
      {
        style: actionStyles.ACTIVE,
        icon: initRegistration ? icons.CONTINUE_LATER : icons.CANCEL,
        onPress: this.doCancel
      },
      {
        style: !_.isEmpty(this.addressValue) && this.isVATValid
          ? actionStyles.TODO
          : actionStyles.DISABLE,
        icon: initRegistration ? icons.NEXT : icons.SAVE,
        onPress: this.doSave
      }
    ];

    return actions;
  };

  doCancel = () => {
    const initRegistration = this.props.navigation.getParam('initRegistration', false);
    initRegistration
      ? this.props.navigation.navigate(screenKeys.Home)
      : this.props.navigation.popToTop();
  };

  doSave = async () => {
    const initRegistration = this.props.navigation.getParam('initRegistration', false);
    registerStore.user.address = this.addressValue;

    if (this.companyValue) {
      registerStore.user.company_name = this.companyValue;
    }

    if (this.vatValue) {
      const isVATValid = REGEX_VAT_VALIDATION.test(this.vatValue);

      if (isVATValid) {
        registerStore.user.vat_number = this.vatValue;
      } else {
        this.isVATValid = false;
        return;
      }
    }

    const isSaved = await registerStore.save();

    if (isSaved) {
      initRegistration
        ? this.navToNextRegistrationStep()
        : this.props.navigation.pop();
    }
  };

  navToNextRegistrationStep = () => {
    const { navigation, t } = this.props;
    const navNext = () => navigation.navigate(
      screenKeys.Identification,
      { initRegistration: true }
    );

    const params = {
      actionNavNext: navNext,
      actionNavBack: () => navigation.navigate(screenKeys.Home),
      actionHandleFileAsync: registerStore.uploadFaceCapture,
      description: t('faceRecognizing:registerCaptureDescription'),
      autohandling: true
    };

    if (registerStore.user.face_capture_required && !DeviceInfo.isEmulator()) {
      navigation.navigate(screenKeys.FaceRecognizer, params);
    } else {
      navNext();
    }
  };

  handleVATChange = value => {
    this.vatValue = value;
    this.isVATValid = true;
  };
}

export default translate()(AddressScreen);
