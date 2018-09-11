import React, { Component } from "react";
import usersStore from '../../stores/usersStore';
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
import { screens, styles, icons, colors } from '../../utils/global'

const GOOGLE_API = 'AIzaSyBZ11c3GCMMBlSpF3H-4DK6PioxJjaFPe0'

@observer
class AddressScreen extends Component {

  onChangeAddres = (data, details) => {
    let address = data.description
    if (details && details.formatted_address) {
      address = details.formatted_address
    }
    usersStore.user.address = address
  }

  render() {

    const { t } = this.props;

    let actions = [
      {
        style: styles.ACTIVE,
        icon: icons.CANCEL,
        onPress: () => this.props.navigation.popToTop()
      },

      {
        style: usersStore.isConnected && usersStore.user && !_.isEmpty(usersStore.user.address) ? styles.TODO : styles.DISABLE,
        icon: icons.SAVE,
        onPress: async () => {
          if (await usersStore.save()) {
            if (_.isEmpty(usersStore.user.identification_scan_front_side)) {
              this.props.navigation.navigate(screens.REGISTER_IDENTIFICATION)
              return
            }
            this.props.navigation.pop()
            return
          }
        }
      },
    ]

    let defaultPaddintTop = 10
    let initialAddress = _.isEmpty(usersStore.user.address) ? '' : usersStore.user.address

    return (
      <Container>
        <HeaderComponent t={t} title={t('register:addressTitle', { user: usersStore.user })} />
        <Content padder>
          <Form>
            <Item stackedLabel>
              <Label style={{ color: colors.TEXT.string(), paddingTop: defaultPaddintTop, paddingBottom: 25 }}>{t('register:addressInputLabel')}</Label>
              <GooglePlacesAutocomplete
                getDefaultValue={() => initialAddress}
                textInputProps={{

                  onChangeText: (text) => { usersStore.user.address = text }
                }}
                onPress={this.onChangeAddres}

                placeholder='Street, number, postal code, city and country'
                minLength={3}
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
