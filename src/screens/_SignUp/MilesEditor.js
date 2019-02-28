import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { translate } from 'react-i18next';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, UFOTextInput } from './../../components/common';
import { screens, actionStyles, icons } from '../../utils/global';
import { registerStore } from './../../stores';
import styles from './styles';

const REGEX_MILES_VALIDATION = /^([0-9]{9}|[0-9]{15})\b/;

@observer
class MilesScreen extends Component {

  @observable milesValue = registerStore.user.miles_and_more;
  @observable isValid = false;

  render() {
    const { t, navigation } = this.props;

    return (
      <UFOContainer image={screens.REGISTER_OVERVIEW.backgroundImage}>
        <UFOHeader
          t={t}
          navigation={navigation}
          title={t('booking:milesPlaceholder', {user: registerStore.user})}
          currentScreen={screens.REGISTER_MILES}
        />
        <View style={styles.bodyWrapper}>
          <UFOTextInput
            autoFocus={true}
            keyboardType="numeric"
            defaultValue={registerStore.user.miles_and_more}
            placeholder={t('booking:milesPlaceholder')}
            onChangeText={this.handleChangeText}
          />
        </View>
        <UFOActionBar actions={this.compileActions()} />
      </UFOContainer>
    );
  }

  @action
  handleChangeText = value => {
    this.milesValue = value;
    this.isValid = REGEX_MILES_VALIDATION.test(value);
  };

  @action
  doSave = async () => {
    registerStore.user.miles_and_more = this.milesValue;
    const isSaved = await registerStore.save();

    if (isSaved) {
      this.props.navigation.pop();
    }
  };

  compileActions = () => {
    return [
      {
        style: actionStyles.ACTIVE,
        icon: icons.CANCEL,
        onPress: () => this.props.navigation.pop()
      },
      {
        style: this.isValid ? actionStyles.TODO : actionStyles.DISABLE,
        icon: icons.SAVE,
        onPress: async () => await this.doSave()
      }
    ];
  };
}

export default translate('translations')(MilesScreen);
