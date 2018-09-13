import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Content, Text } from 'native-base';
import { SectionList, View, TouchableHighlight } from 'react-native'
import { observer } from "mobx-react";

import HeaderComponent from "../../components/header";
import ActionBarComponent from '../../components/actionBar'
import Icon from '../../components/Icon'
import { actionStyles, icons, colors, sizes, navigationParams } from '../../utils/global'
import supportStore from "../../stores/supportStore";

@observer
class SupportFaqScreen extends Component {


  render() {
    const { t, navigation } = this.props;

    let faqReference = this.props.navigation.getParam(navigationParams.SUPPORT_FAQ);
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      },
    ]
    return (
      <Container>
        <HeaderComponent t={t} navigation={navigation} title={t('support:supportTitle')} subTitle={faqReference} />
        <Content padder>

        </Content>
        <ActionBarComponent actions={actions} />
      </Container>
    );
  }
}
export default translate("translations")(SupportFaqScreen);
