import React, { Component } from "react";
import usersStore from '../../stores/usersStore';
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import { Container, Content, Form, Item, Label, Input } from 'native-base';
import _ from 'lodash'

import HeaderComponent from "../../components/header";
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import { screens, styles, icons } from '../../utils/global'

@observer
class EmailScreen extends Component {

  render() {

    const { t } = this.props;
    let actions = [
      {
        style: styles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      },
      {
        style: styles.ACTIVE,
        icon: icons.HOME,
        onPress: () => this.props.navigation.navigate(screens.HOME)
      },
      {
        style: styles.TODO,
        icon: icons.NEXT,
        onPress: () => this.props.navigation.navigate(screens.REGISTER_ADDRESS)
      },
    ]
    return (
      <Container>
        <HeaderComponent title={t('register:emailTitle', { user: usersStore.user })} />
        <Content padder>
          <Form>
            <Item floatingLabel last>
              <Label>{t('register:emailInputLabel')}</Label>
              <Input />
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
