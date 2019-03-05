import React, { Component } from 'react';
import { Keyboard } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DeviceInfo from 'react-native-device-info';

import { UFOHeader } from './../../components/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, UFOTextInputBold } from './../../components/common';
import screenKeys from './../../navigators/helpers/screenKeys';
import { registerStore } from './../../stores';
import { GOOGLE_API_KEY } from './../../utils/configurations';
import styles, { googleInputStyles } from './styles';
// deprecated, using in old UFOActionBar
import { actionStyles, icons } from './../../utils/global';

const IS_EMULATOR = DeviceInfo.isEmulator();
const REGEX_VAT_VALIDATION = /^((AT)?U[0-9]{8}|(BE)?0[0-9]{9}|(BG)?[0-9]{9,10}|(CY)?[0-9]{8}L|(CZ)?[0-9]{8,10}|(DE)?[0-9]{9}|(DK)?[0-9]{8}|(EE)?[0-9]{9}|(EL|GR)?[0-9]{9}|(ES)?[0-9A-Z][0-9]{7}[0-9A-Z]|(FI)?[0-9]{8}|(FR)?[0-9A-Z]{2}[0-9]{9}|(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})|(HU)?[0-9]{8}|(IE)?[0-9]S[0-9]{5}L|(IT)?[0-9]{11}|(LT)?([0-9]{9}|[0-9]{12})|(LU)?[0-9]{8}|(LV)?[0-9]{11}|(MT)?[0-9]{8}|(NL)?[0-9]{9}B[0-9]{2}|(PL)?[0-9]{10}|(PT)?[0-9]{9}|(RO)?[0-9]{2,10}|(SE)?[0-9]{12}|(SI)?[0-9]{8}|(SK)?[0-9]{10})$/;
const REGEX_ADDRESS_INVALID = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\>|\?|\/|\""|\;|\:|\_/;

@observer
class BillingInfoEditorScreen extends Component {
  scrollContainerRef = React.createRef();
  keyboardDidShowListener = null;

  @observable addressValue = registerStore.user.address;
  @observable companyValue = registerStore.user.company_name;
  @observable vatValue = registerStore.user.vat_number;
  @observable placesListDisplayed = false;
  @observable isVATValid = true;
  @observable isAddressValid = this.validateAddress();

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.onKeyboardShow);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
  }

  render() {
    const { t } = this.props;

    return (
      <UFOContainer style={styles.container}>
        <UFOHeader
          title={t('addressHeader')}
          leftBtnIcon="keyboard-backspace"
          leftBtnAction={this.doCancel}
          rightBtnUseDefault={true}
        />
        <KeyboardAwareScrollView
          contentContainerStyle={[ styles.scrollContainer, styles.actionBarIndent ]}
          keyboardShouldPersistTaps="handled"
          ref={this.scrollContainerRef}
        >
          <UFOTextInputBold
            title={t('companyNameLabel')}
            containerStyle={styles.blockShadow}
            defaultValue={this.companyValue}
            onChangeText={this.onChangeCompany}
            placeholder={t('optionalPlaceholder')}
          />
          <UFOTextInputBold
            title={t('vatNumberLabel')}
            containerStyle={[ styles.nextInputIndent, styles.blockShadow ]}
            defaultValue={this.vatValue}
            onChangeText={this.onVATChange}
            autoCapitalize="characters"
            invalidStatus={!this.isVATValid}
            placeholder={t('optionalPlaceholder')}
          />
          <UFOTextInputBold
            title={t('addressLabel')}
            containerStyle={[ styles.nextInputIndent, styles.blockShadow ]}
            InputComponent={this.renderGoogleInput()}
            invalidStatus={!this.isAddressValid}
          />
        </KeyboardAwareScrollView>
        <UFOActionBar actions={this.compileActions} />
      </UFOContainer>
    );
  }

  renderGoogleInput = () => {
    const { i18n } = this.props;

    return (
      <GooglePlacesAutocomplete
        getDefaultValue={this.getAddressDefault}
        textInputProps={{
          onChangeText: this.onAddressChange,
          onFocus: this.onFocusAddressInput,
          onBlur: this.onBlurAddressInput
        }}
        onPress={this.onAddressSelect}
        numberOfLines={2}
        enablePoweredByContainer={false}
        minLength={4}
        autoFocus={!this.addressValue}
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
        placeholder=""
      />
    );
  };

  get compileActions() {
    const initRegistration = this.props.navigation.getParam('initRegistration', false);
    return [
      {
        style: actionStyles.ACTIVE,
        icon: initRegistration ? icons.CONTINUE_LATER : icons.CANCEL,
        onPress: this.doCancel
      },
      {
        style: this.isAddressValid && this.isVATValid
          ? actionStyles.TODO
          : actionStyles.DISABLE,
        icon: initRegistration ? icons.NEXT : icons.SAVE,
        onPress: this.doSave
      }
    ];
  }

  /*
   * Cancel editing and undo all changes
  */
  doCancel = () => {
    const { navigation } = this.props;
    const initRegistration = navigation.getParam('initRegistration', false);
    initRegistration ? navigation.navigate(screenKeys.Home) : navigation.popToTop();
  };

  /*
   * Validate and save all changes
  */
  doSave = async () => {
    const initRegistration = this.props.navigation.getParam('initRegistration', false);
    this.isAddressValid = this.validateAddress();

    if (!this.isAddressValid) {
      return;
    }

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
      initRegistration ? this.navToNextRegistrationStep() : this.props.navigation.pop();
    }
  };

  /*
   * Validate current address input value
  */
  validateAddress = () => {
    const minLength = 4;
    const invalid = !this.addressValue
      || this.addressValue.length < minLength
      || REGEX_ADDRESS_INVALID.test(this.addressValue);

    return !invalid;
  };

  /*
   * Nav to next step if first registration
  */
  navToNextRegistrationStep = () => {
    const { navigation, t } = this.props;
    const navNext = () => navigation.navigate(
      screenKeys.IdCardEditor,
      { initRegistration: true }
    );

    const params = {
      actionNavNext: navNext,
      actionNavBack: () => navigation.navigate(screenKeys.Home),
      actionHandleFileAsync: registerStore.uploadFaceCapture,
      description: t('faceRecognizing:registerCaptureDescription'),
      autohandling: true
    };

    if (registerStore.user.face_capture_required && !IS_EMULATOR) {
      navigation.navigate(screenKeys.FaceRecognizer, params);
    } else {
      navNext();
    }
  };

  /*
   * Change address input
  */
  onAddressChange = value => {
    this.addressValue = value;
    this.isAddressValid = true;
  };

  /*
   * Select address from autocomplate
  */
  onAddressSelect = (data, details) => {
    let address = data.description;

    if (details && details.formatted_address) {
      address = details.formatted_address;
    }

    this.addressValue = address;
    this.isAddressValid = true;
  };

  /*
   * Focus at input
  */
  onFocusAddressInput = () => {
    this.placesListDisplayed = true;
  };

  /*
   * Blur at input
  */
  onBlurAddressInput = () => {
    this.placesListDisplayed = false;
  };

  /*
   * Default value for address input
  */
  getAddressDefault = () => this.addressValue || '';

  /*
   * Change VAT input
  */
  onVATChange = value => {
    this.vatValue = value;
    this.isVATValid = true;
  };

  /*
   * Change company input
  */
  onChangeCompany = value => {
    this.companyValue = value;
  };

  /*
   * Listen keyboard appearance
  */
  onKeyboardShow = () => {
    this.scrollContainerRef.current.scrollToEnd();
  };
}

export default translate('register')(BillingInfoEditorScreen);
