import React, { Component } from "react";
import registerStore from '../../stores/registerStore';
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import { View } from 'react-native';
import _ from 'lodash'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer } from '../../components/common'
import { screens, actionStyles, icons, colors } from '../../utils/global'
import { observable, action } from "mobx";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import UFOCard from "../../components/UFOCard";

const GOOGLE_API = 'AIzaSyBZ11c3GCMMBlSpF3H-4DK6PioxJjaFPe0'

@observer
class AddressScreen extends Component {

  @observable addressValue = registerStore.user.address

  @action
  doCancel = async (isInWizzard) => {
    isInWizzard ? this.props.navigation.navigate(screens.HOME.name) : this.props.navigation.popToTop()
  }

  @action
  doSave = async (isInWizzard) => {
    registerStore.user.address = this.addressValue
    if (await registerStore.save()) {
      if (isInWizzard) {
        this.props.navigation.navigate(screens.REGISTER_IDENTIFICATION.name, { 'isInWizzard': isInWizzard })
        return
      }
      this.props.navigation.pop()
      return
    }
  }


  render() {

    const { t, navigation } = this.props;
    let isInWizzard = this.props.navigation.getParam('isInWizzard', false)

    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: isInWizzard ? icons.CONTINUE_LATER : icons.CANCEL,
        onPress: async () => await this.doCancel(isInWizzard)
      },

      {
        style: !_.isEmpty(this.addressValue) && this.addressValue !== registerStore.user.address ? actionStyles.TODO : actionStyles.DISABLE,
        icon: isInWizzard ? icons.NEXT : icons.SAVE,
        onPress: async () => {
          await this.doSave(isInWizzard)
        }
      },
    ]

    return (
      <UFOContainer image={screens.REGISTER_ADDRESS.backgroundImage}>
        <UFOHeader t={t} navigation={navigation} title={t('register:addressTitle', { user: registerStore.user })} currentScreen={screens.REGISTER_ADDRESS} />
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          resetScrollToCoords={{ x: 0, y: 0 }}
        >
          <View style={{ paddingTop: "20%", paddingHorizontal: 10, flex: 0.80, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
            <UFOCard title={t('register:addressInputLabel')}>

              <GooglePlacesAutocomplete
                getDefaultValue={() => registerStore.user.address ? registerStore.user.address : ''}
                textInputProps={{
                  onChangeText: (text) => { this.addressValue = text }
                }}
                onPress={(data, details) => {
                  let address = data.description
                  if (details && details.formatted_address) {
                    address = details.formatted_address
                  }
                  this.addressValue = address
                }}
                numberOfLines={2}
                enablePoweredByContainer={false}
                placeholder={t('register:addressInputPlaceholder')}
                minLength={4}
                autoFocus={true}
                returnKeyType={'default'}
                fetchDetails={true}
                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: GOOGLE_API,
                }}
                styles={{
                  textInputContainer: {
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    borderBottomWidth: 1,
                    borderColor: colors.ACTIVE.string(),
                    width: '100%'

                  },
                  textInput: {
                    backgroundColor: 'transparent',
                    marginLeft: 0,
                    marginRight: 0,
                    height: 38,
                    color: colors.TEXT.string(),
                    fontSize: 16
                  },
                  listView: {
                    backgroundColor: 'transparent',
                  },
                  description: {
                    color: colors.DISABLE.string()
                  },
                  poweredContainer: {
                    height: 0,
                  }
                }}
                currentLocation={false}
              />

            </UFOCard>
          </View>
        </KeyboardAwareScrollView>
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }
}

export default translate("translations")(AddressScreen);
