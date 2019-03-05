import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, UFOTextInput } from './../../components/common';
import { keys as screenKeys } from './../../navigators/helpers';
import { screens, actionStyles, icons } from './../../utils/global';
import { registerStore } from './../../stores';
import styles from './styles';

const REGEX_EMAIL_VALIDATION = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@observer
class EmailScreen extends Component {
  @observable emailValue = registerStore.user.email;

  render() {
    const { t, navigation } = this.props;

    return (
      <UFOContainer image={screens.REGISTER_OVERVIEW.backgroundImage}>
        <UFOHeader
          t={t}
          navigation={navigation}
          title={t('register:emailTitle', {user: registerStore.user})}
          currentScreen={screens.REGISTER_EMAIL}
        />
        <View style={styles.bodyWrapper}>
          <UFOTextInput
            autoFocus={true}
            keyboardType="email-address"
            defaultValue={registerStore.user.email}
            placeholder={t('register:emailInputLabel')}
            onChangeText={value => (this.emailValue = value)}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textContentType="emailAddress"
            enablesReturnKeyAutomatically={true}
          />
        </View>
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
        style: this.emailValue
          && REGEX_EMAIL_VALIDATION.test(this.emailValue)
          && this.emailValue !== registerStore.user.email
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
    registerStore.user.email = this.emailValue;
    const isSaved = await registerStore.save();

    if (isSaved) {
      initRegistration
        ? this.props.navigation.navigate(screenKeys.Address, { initRegistration: true })
        : this.props.navigation.pop();
    }
  };
}

export default translate()(EmailScreen);
