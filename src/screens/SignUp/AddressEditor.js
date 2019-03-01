import React, { Component } from 'react';
import { View, LayoutAnimation, Text } from 'react-native';
import { observer } from 'mobx-react';
import { observable, reaction } from 'mobx';
import { translate } from 'react-i18next';
import _ from 'lodash';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DeviceInfo from 'react-native-device-info';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, UFOTextInput } from './../../components/common';
import screenKeys from './../../navigators/helpers/screenKeys';
import { screens, actionStyles, icons } from './../../utils/global';
import { registerStore } from './../../stores';
import { GOOGLE_API_KEY } from './../../utils/configurations';
import styles, { googleInputStyles } from './styles';

@observer
class AddressScreen extends Component {
  render() {
    return (
      <UFOContainer style={styles.container}>
        <Text>
          ADDRESS EDITOR
        </Text>
      </UFOContainer>
    );
  }
}

export default translate()(AddressScreen);
