import React, { Component } from "react";
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import { Dimensions, Keyboard } from 'react-native';
import { Container, Content, Form, Item, Label, Input } from 'native-base';
import _ from 'lodash'

import usersStore from '../../stores/usersStore';
import HeaderComponent from "../../components/header";
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import { screens, styles, icons, colors } from '../../utils/global'
import { observable } from "mobx";

@observer
class EmailScreen extends Component {

  //TODO fix as this doesn't change the topPadding, no urgent I keep the code for reference
  @observable keyboardHeight = 0

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

  onChangeEmail = (email) => {
    usersStore.user.email = email
  }

  render() {

    const { t } = this.props;

    let actions = [
      {
        style: styles.ACTIVE,
        icon: icons.CANCEL,
        onPress: () => this.props.navigation.popToTop()
      },
      {
        style: usersStore.isConnected && usersStore.user.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usersStore.user.email) ? styles.TODO : styles.DISABLE,
        icon: icons.SAVE,
        onPress: async () => {
          if (await usersStore.save()) {
            if (_.isEmpty(usersStore.user.address)) {
              this.props.navigation.navigate(screens.REGISTER_ADDRESS)
              return
            }
            this.props.navigation.pop()
            return
          }
        }
      },
    ]

    let defaultPaddintTop = ((Dimensions.get("window").height - this.keyboardHeight) / 10)

    return (
      <Container>
        <HeaderComponent t={t} title={t('register:emailTitle', { user: usersStore.user })} />
        <Content padder>
          <Form>
            <Item stackedLabel>
              <Label style={{ color: colors.TEXT.string(), paddingTop: defaultPaddintTop, paddingBottom: 25 }}>{t('register:emailInputLabel')}</Label>
              <Input autoFocus defaultValue={usersStore.user.email} keyboardAppearance='dark' placeholder='john.doe@gmail.com' ref={(ref) => { this.emailInput = ref; }} onChangeText={this.onChangeEmail} />
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
