import React, { Component } from 'react';
import { View, LayoutAnimation, Text, ScrollView } from 'react-native';
import { observer } from 'mobx-react';
import { observable, reaction } from 'mobx';
import { translate } from 'react-i18next';
import _ from 'lodash';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import DeviceInfo from 'react-native-device-info';

import { UFOHeader } from './../../components/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, UFOTextInput } from './../../components/common';
import screenKeys from './../../navigators/helpers/screenKeys';
import { screens, actionStyles, icons } from './../../utils/global';
import { registerStore } from './../../stores';
import { GOOGLE_API_KEY } from './../../utils/configurations';
import styles, { googleInputStyles } from './styles';

const REGEX_VAT_VALIDATION = /^((AT)?U[0-9]{8}|(BE)?0[0-9]{9}|(BG)?[0-9]{9,10}|(CY)?[0-9]{8}L|(CZ)?[0-9]{8,10}|(DE)?[0-9]{9}|(DK)?[0-9]{8}|(EE)?[0-9]{9}|(EL|GR)?[0-9]{9}|(ES)?[0-9A-Z][0-9]{7}[0-9A-Z]|(FI)?[0-9]{8}|(FR)?[0-9A-Z]{2}[0-9]{9}|(GB)?([0-9]{9}([0-9]{3})?|[A-Z]{2}[0-9]{3})|(HU)?[0-9]{8}|(IE)?[0-9]S[0-9]{5}L|(IT)?[0-9]{11}|(LT)?([0-9]{9}|[0-9]{12})|(LU)?[0-9]{8}|(LV)?[0-9]{11}|(MT)?[0-9]{8}|(NL)?[0-9]{9}B[0-9]{2}|(PL)?[0-9]{10}|(PT)?[0-9]{9}|(RO)?[0-9]{2,10}|(SE)?[0-9]{12}|(SI)?[0-9]{8}|(SK)?[0-9]{10})$/;

@observer
class AddressScreen extends Component {
  render() {
    return (
      <UFOContainer style={styles.container}>
        <UFOHeader
          title={this.props.t('contactsHeaderStage1')}
          leftBtnIcon="keyboard-backspace"
          leftBtnAction={this.doCancel}
          rightBtnUseDefault={true}
        />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        </ScrollView>
      </UFOContainer>
    );
  }

  doCancel = () => {
    const initRegistration = this.props.navigation.getParam('initRegistration', false);

    initRegistration
      ? this.props.navigation.navigate(screenKeys.Home)
      : this.props.navigation.popToTop();
  };
}

export default translate()(AddressScreen);
