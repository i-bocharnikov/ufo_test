import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { translate } from 'react-i18next';
import _ from 'lodash';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, ufoInputStyles } from './../../components/common';
import {
  screens,
  actionStyles,
  icons,
  colors
} from './../../utils/global';
import registerStore from './../../stores/registerStore';
import { GOOGLE_API_KEY } from './../../utils/configurations';
import styles from './styles';

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

  @action
  doCancel = async isInWizzard => {
    isInWizzard
      ? this.props.navigation.navigate(screens.HOME.name)
      : this.props.navigation.popToTop();
  };

  @action
  doSave = async isInWizzard => {
    registerStore.user.address = this.addressValue;

    if (await registerStore.save()) {
      if (isInWizzard) {
        this.props.navigation.navigate(screens.REGISTER_IDENTIFICATION.name, { isInWizzard });
        return;
      }

      this.props.navigation.pop();
      return;
    }
  };

  compileActions = () => {
    const isInWizzard = this.props.navigation.getParam('isInWizzard', false);
    const actions = [
      {
        style: actionStyles.ACTIVE,
        icon: isInWizzard ? icons.CONTINUE_LATER : icons.CANCEL,
        onPress: async () => await this.doCancel(isInWizzard)
      },

      {
        style: !_.isEmpty(this.addressValue) && this.addressValue !== registerStore.user.address
          ? actionStyles.TODO
          : actionStyles.DISABLE,
        icon: isInWizzard ? icons.NEXT : icons.SAVE,
        onPress: async () => await this.doSave(isInWizzard)
      }
    ];

    return actions;
  };
}

export default translate('translations')(AddressScreen);
