import React, { Component } from "react";
import registerStore from '../../stores/registerStore';
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import { Dimensions, Keyboard } from 'react-native';
import { Container, Content, Form, Item, Label } from 'native-base';
import { Text, Image } from 'react-native'
import _ from 'lodash'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import HeaderComponent from "../../components/header";
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import { screens, actionStyles, icons, colors } from '../../utils/global'
import { observable, action } from "mobx";

const GOOGLE_API = 'AIzaSyBZ11c3GCMMBlSpF3H-4DK6PioxJjaFPe0'

@observer
class AddressScreen extends Component {

  @observable addressValue = registerStore.user.address

  @action
  doCancel = async (isInWizzard) => {
    isInWizzard ? this.props.navigation.navigate(screens.HOME) : this.props.navigation.popToTop()
  }

  @action
  doSave = async (isInWizzard) => {
    registerStore.user.address = this.addressValue
    if (await registerStore.save()) {
      if (isInWizzard) {
        this.props.navigation.navigate(screens.REGISTER_IDENTIFICATION, { 'isInWizzard': isInWizzard })
        return
      }
      this.props.navigation.pop()
      return
    }
  }


  render() {

    const { t } = this.props;
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
      <Container>
        <HeaderComponent t={t} title={t('register:addressTitle', { user: registerStore.user })} />
        <Content padder>
          <Form>
            <Item stackedLabel>
              <Label style={{ color: colors.TEXT.string(), paddingTop: 10, paddingBottom: 25 }}>{t('register:addressInputLabel')}</Label>
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
                    backgroundColor: colors.BACKGROUND.string(),
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    width: '100%'

                  },
                  textInput: {
                    backgroundColor: colors.BACKGROUND.string(),
                    marginLeft: 0,
                    marginRight: 0,
                    height: 38,
                    color: colors.TEXT.string(),
                    fontSize: 16
                  },
                  listView: {
                    backgroundColor: colors.BACKGROUND.string(),
                  },
                  description: {
                    color: colors.TEXT.string()
                  },
                  poweredContainer: {
                    height: 0,
                    backgroundColor: colors.BACKGROUND.string(),
                  }
                }}
                currentLocation={false}
              />
            </Item>
          </Form>
        </Content>
        <ActionSupportComponent onPress={() => this.props.navigation.navigate(screens.SUPPORT, { context: screens.REGISTER_ADDRESS })} />
        <ActionBarComponent actions={actions} />
      </Container>
    );
  }
}

export default translate("translations")(AddressScreen);
