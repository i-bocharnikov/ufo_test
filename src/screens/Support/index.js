import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';
import i18n from 'i18next';
import call from 'react-native-phone-call';
import { observer } from 'mobx-react';

import { driveStore } from './../../stores';
import SupportInnerTabNavigator from './../../navigators/components/SupportInnerTabNavigator';
import { supportBackBtnState } from './../../navigators/helpers/navStateListener';
import { UFOHeader } from './../../components/UFOHeader';
import styles from './styles';

@observer
class SupportScreen extends Component {
  static router = SupportInnerTabNavigator.router;

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.navBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.navBack);
  }

  render() {
    return (
      <View style={styles.tabWrapper}>
        <UFOHeader
          title={i18n.t('support:overviewHeader')}
          leftBtnAction={this.navBack}
          leftBtnIcon="keyboard-backspace"
          rightBtnAction={driveStore.emergencyNumber ? this.callToSupport : null}
          rightBtnIcon="phone"
          isSingle={false}
        />
        <SupportInnerTabNavigator navigation={this.props.navigation} />
      </View>
    );
  }

  navBack = () => {
    const { navigation } = this.props;

    if (navigation.isFocused()) {
      navigation.navigate(supportBackBtnState.navBackScreenKey);
      return true;
    }

    return false;
  };

  callToSupport = () => {
    call({
      number: driveStore.emergencyNumber,
      prompt: false
    });
  };
}

export default SupportScreen;
