import React, { Component } from "react";
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import { Dimensions, Keyboard } from 'react-native';
import { Container, Content, Form, Item, Label, Input } from 'native-base';
import _ from 'lodash'

import registerStore from '../../stores/registerStore';
import HeaderComponent from "../../components/header";
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import { screens, styles, icons, colors, params } from '../../utils/global'
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
    isInWizzard ? this.props.navigation.navigate(screens.HOME) : this.props.navigation.popToTop()
  }

  @action
  doSave = async (isInWizzard) => {
    registerStore.user.email = this.emailValue
    if (await registerStore.save()) {
      if (isInWizzard) {
        this.props.navigation.navigate(screens.REGISTER_ADDRESS, { 'isInWizzard': isInWizzard })
        return
      }
      this.props.navigation.pop()
      return
    }
  }

  render() {

    const { t } = this.props;

    let isInWizzard = this.props.navigation.getParam('isInWizzard', false)

    let actions = [
      {
        style: styles.ACTIVE,
        icon: isInWizzard ? icons.CONTINUE_LATER : icons.CANCEL,
        onPress: async () => await this.doCancel(isInWizzard)
      },
      {
        style: this.emailValue && REGEX_EMAIL_VALIDATION.test(this.emailValue) && this.emailValue !== registerStore.user.email ? styles.TODO : styles.DISABLE,
        icon: isInWizzard ? icons.NEXT : icons.SAVE,
        onPress: async () => await this.doSave(isInWizzard)
      },
    ]

    let defaultPaddintTop = ((Dimensions.get("window").height - this.keyboardHeight) / 10)

    return (
      <Container>
        <HeaderComponent t={t} title={t('register:emailTitle', { user: registerStore.user })} />
        <Content padder>
          <Form>
            <Item stackedLabel>
              <Label style={{ color: colors.TEXT.string(), paddingTop: defaultPaddintTop, paddingBottom: 25 }}>{t('register:emailInputLabel')}</Label>
              <Input autoFocus defaultValue={registerStore.user.email} keyboardAppearance='dark' placeholder='john.doe@gmail.com' ref={(ref) => { this.emailInput = ref; }} onChangeText={(text) => this.emailValue = text} />
            </Item>
          </Form>
        </Content>
        <ActionSupportComponent onPress={() => this.props.navigation.navigate(screens.SUPPORT, { context: screens.REGISTER_EMAIL })} />
        <ActionBarComponent actions={actions} />
      </Container>
    );
  }
}

export default translate("translations")(EmailScreen);
