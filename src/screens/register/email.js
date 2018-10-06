import React, { Component } from "react";
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import { View, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import _ from 'lodash'

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOTextInput } from '../../components/common'
import { screens, actionStyles, icons, colors, dims } from '../../utils/global'
import { observable, action } from "mobx";
import registerStore from '../../stores/registerStore';
import UFOCard from "../../components/UFOCard";

const REGEX_EMAIL_VALIDATION = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

@observer
class EmailScreen extends Component {

  //TODO fix as this doesn't change the topPadding, no urgent I keep the code for reference
  @observable keyboardHeight = 0
  @observable emailValue = registerStore.user.email

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow(e) {
    this.keyboardHeight = e.endCoordinates.height;
  }

  _keyboardDidHide(e) {
    this.keyboardHeight = 0;
  }

  @action
  doCancel = async (isInWizzard) => {
    isInWizzard ? this.props.navigation.navigate(screens.HOME.name) : this.props.navigation.popToTop()
  }

  @action
  doSave = async (isInWizzard) => {
    registerStore.user.email = this.emailValue
    if (await registerStore.save()) {
      if (isInWizzard) {
        this.props.navigation.navigate(screens.REGISTER_ADDRESS.name, { 'isInWizzard': isInWizzard })
        return
      }
      this.props.navigation.pop()
      return
    }
  }

  render() {

    const { t, navigation } = this.props;

    let isInWizzard = this.props.navigation.getParam('isInWizzard', false)

    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: isInWizzard ? icons.CONTINUE_LATER : icons.CANCEL,
        onPress: async () => await this.doCancel(isInWizzard)
      },
      {
        style: this.emailValue && REGEX_EMAIL_VALIDATION.test(this.emailValue) && this.emailValue !== registerStore.user.email ? actionStyles.TODO : actionStyles.DISABLE,
        icon: isInWizzard ? icons.NEXT : icons.SAVE,
        onPress: async () => await this.doSave(isInWizzard)
      },
    ]

    return (
      <UFOContainer image={screens.REGISTER_EMAIL.backgroundImage}>
        <UFOHeader transparent t={t} navigation={navigation} title={t('register:emailTitle', { user: registerStore.user })} currentScreen={screens.REGISTER_EMAIL} />
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          resetScrollToCoords={{ x: 0, y: 0 }}>
          <View style={{ paddingTop: dims.CONTENT_PADDING_TOP, paddingHorizontal: 10, flex: 0.80, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center' }}>
            <UFOCard title={t('register:emailInputLabel')}>
              <UFOTextInput autoFocus keyboardType='email-address' defaultValue={registerStore.user.email} placeholder='john.doe@gmail.com' onChangeText={(text) => this.emailValue = text} />
            </UFOCard>
          </View>
        </KeyboardAwareScrollView>
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }
}

export default translate("translations")(EmailScreen);
