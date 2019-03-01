import React, { Component, Fragment } from 'react';
import { View, BackHandler, Text } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import {
  UFOContainer,
  UFOTextInput,
  ufoInputStyles
} from './../../components/common';
import screenKeys from './../../navigators/helpers/screenKeys';
import { screens, actionStyles, icons } from './../../utils/global';
import { appStore, registerStore } from './../../stores';
import styles from './styles';

class PhoneScreen extends Component {
  render() {
    return (
      <UFOContainer style={styles.container}>
        <Text>
          CONTACTS EDITOR
        </Text>
      </UFOContainer>
    );
  }
}

export default translate()(PhoneScreen);
