import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import _ from 'lodash';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DeviceInfo from 'react-native-device-info';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, ufoInputStyles } from './../../components/common';
import { keys as screenKeys } from './../../navigators/helpers';
import { screens, actionStyles, icons, colors } from './../../utils/global';
import { registerStore } from './../../stores';
import { GOOGLE_API_KEY } from './../../utils/configurations';

const googleInputStyles = StyleSheet.create({
  container: {
    flex: 0,
    marginLeft: 24,
    marginRight: 24
  },
  textInputContainer: {
    height: 'auto',
    backgroundColor: 'transparent',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 32,
    borderTopWidth: 0
  },
  textInput: {
    ...ufoInputStyles,
    marginLeft: 0,
    marginRight: 0,
    borderRadius: 0
  },
  separator: { backgroundColor: 'transparent' },
  row: {
    backgroundColor: colors.INPUT_BG,
    marginLeft: 0,
    marginRight: 0
  }
});

@observer
class AddressScreen extends Component {
  @observable addressValue = registerStore.user.address;

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
            textInputProps={{ onChangeText: text => (this.addressValue = text) }}
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
            autoFocus={true}
            returnKeyType="default"
            fetchDetails={true}
            query={{
              key: GOOGLE_API_KEY,
              language: i18n.language
            }}
            currentLocation={false}
            debounce={200}
            styles={googleInputStyles}
          />
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
        style: !_.isEmpty(this.addressValue) && this.addressValue !== registerStore.user.address
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
    const isSaved = await registerStore.save();

    if (isSaved) {
      initRegistration
        ? this.navToNextRegisterStep()
        : this.props.navigation.pop();
    }
  };

  navToNextRegisterStep = () => {
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
}

export default translate()(AddressScreen);
