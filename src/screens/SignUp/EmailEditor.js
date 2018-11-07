import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { translate } from 'react-i18next';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, UFOTextInput } from './../../components/common';
import { screens, actionStyles, icons } from '../../utils/global'
import registerStore from './../../stores/registerStore';
import UFOCard from './../../components/UFOCard';
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
          />
        </View>
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
    registerStore.user.email = this.emailValue;

    if (await registerStore.save()) {
      if (isInWizzard) {
        this.props.navigation.navigate(screens.REGISTER_ADDRESS.name, { isInWizzard });
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
        style: this.emailValue
          && REGEX_EMAIL_VALIDATION.test(this.emailValue)
          && this.emailValue !== registerStore.user.email
            ? actionStyles.TODO
            : actionStyles.DISABLE,
        icon: isInWizzard ? icons.NEXT : icons.SAVE,
        onPress: async () => await this.doSave(isInWizzard)
      }
    ];

    return actions;
  };
}

export default translate('translations')(EmailScreen);
