import React, { Component } from "react";
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import { Dimensions, Keyboard } from 'react-native';
import { Content, Form, Item, Label, Input } from 'native-base';
import _ from 'lodash'

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage } from '../../components/common'
import { screens, actionStyles, icons, colors } from '../../utils/global'
import { observable, action } from "mobx";

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

    let defaultPaddintTop = ((Dimensions.get("window").height - this.keyboardHeight) / 10)

    return (
      <UFOContainer>
        <UFOHeader t={t} navigation={navigation} title={t('register:emailTitle', { user: registerStore.user })} currentScreen={screens.REGISTER_EMAIL} />
        <Content padder>
          <Form>
            <Item stackedLabel>
              <Label style={{ color: colors.TEXT.string(), paddingTop: defaultPaddintTop, paddingBottom: 25 }}>{t('register:emailInputLabel')}</Label>
              <Input autoFocus defaultValue={registerStore.user.email} keyboardAppearance='dark' placeholder='john.doe@gmail.com' ref={(ref) => { this.emailInput = ref; }} onChangeText={(text) => this.emailValue = text} />
            </Item>
          </Form>
        </Content>
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }
}

export default translate("translations")(EmailScreen);
