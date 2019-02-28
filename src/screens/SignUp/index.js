import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import { registerStore } from './../../stores';
import SignUpInnerTabNavigator from './../../navigators/components/SignUpInnerTabNavigator';
import UFOPopover from './../../components/UFOPopover';
import { UFOHeader } from './../../components/UFOHeader';
import styles from './styles';

@observer
class SignUpScreen extends Component {
  static router = SignUpInnerTabNavigator.router;

  render() {
    return (
      <View style={styles.tabWrapper}>
        <UFOHeader
          title={registerStore.userFullName || this.props.t('overviewTitle')}
          leftBtnUseDefault={true}
          rightBtnUseDefault={true}
        />
        <SignUpInnerTabNavigator navigation={this.props.navigation} />
        <UFOPopover message={registerStore.user.registration_message} />
      </View>
    );
  }
}

export default translate('register')(SignUpScreen);
