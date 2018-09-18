import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Content, Text, Title, H2, H3 } from 'native-base';
import { NavigationEvents } from 'react-navigation';
import { SectionList, View, TouchableHighlight } from 'react-native'
import { observer } from "mobx-react";
import { observable } from "mobx";
import call from 'react-native-phone-call'

import HeaderComponent from "../../components/header";
import ActionBarComponent from '../../components/actionBar'
import Icon from '../../components/Icon'
import { actionStyles, icons, colors, sizes, navigationParams, screens } from '../../utils/global'
import supportStore from "../../stores/supportStore";
import driveStore from "../../stores/driveStore";

const SUPPORT_FAQ = navigationParams.SUPPORT_FAQ
const SUPPORT_FAQ_CATEGORY = navigationParams.SUPPORT_FAQ_CATEGORY

@observer
class SupportFaqsScreen extends Component {

  @observable
  refreshing = false

  @observable
  section = null


  onLoad = async (payload) => {
    if (payload && payload.state && payload.state.routeName !== 'SupportFaqs') {
      return
    }
    await this.doRefresh()
    this.section = this.props.navigation.getParam(navigationParams.SUPPORT_FAQ_CATEGORY);
  }

  onPressSection = (reference) => {
    if (this.section === reference) {
      this.section = null
    }
    else {
      this.section = reference
    }
  }

  onPressItem = (sectionReference, reference) => {
    this.props.navigation.navigate(screens.SUPPORT_FAQ.name, { SUPPORT_FAQ_CATEGORY: sectionReference, SUPPORT_FAQ: reference })
  }

  doRefresh = async () => { return await supportStore.list() }

  doBack = async (navigation) => {
    this.props.navigation.navigate(navigation.getParam(navigationParams.PREVIOUS_SCREEN, screens.HOME).name)
  }

  doOpenChat = async (navigation) => {
    this.props.navigation.navigate(screens.SUPPORT_CHAT.name)
  }

  doCall = async (number) => {
    call(
      {
        number: number, // String value with the number to call
        prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
      }
    )
  }


  renderSection = ({ section: { reference, name, isOpen } }) => (
    <TouchableHighlight
      key={reference}
      onPress={() => this.onPressSection(reference)}>
      <View style={{ padding: 8, flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
        <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', backgroundColor: colors.ACTIVE.string(), borderRadius: 5 }}>
          <H3 style={{ color: colors.HEADER_TEXT.string() }}>{name}</H3>
          <Icon icon={isOpen ? icons.SEGMENT_OPEN : icons.SEGMENT_CLOSE} size={sizes.SMALL} />
        </View>
      </View>
    </TouchableHighlight >
  )

  renderItem = ({ item: { reference, title }, index, section }) => (
    <TouchableHighlight
      key={reference}
      onPress={() => this.onPressItem(section.reference, reference)}>
      <View style={{ padding: 8, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', }}>
        <Text style={{}}>{title}</Text>
        <Icon inverted icon={icons.NEXT} size={sizes.SMALL} />
      </View>
    </TouchableHighlight >
  )


  render() {
    const { t, navigation } = this.props;


    let actions = []

    actions.push({
      style: actionStyles.ACTIVE,
      icon: icons.BACK,
      onPress: () => this.doBack(navigation)
    })

    if (driveStore.emergencyNumber) {
      actions.push({
        style: actionStyles.TODO,
        icon: icons.EMERGENCY_CALL,
        onPress: () => this.doCall(driveStore.emergencyNumber)
      })
    }

    actions.push({
      style: actionStyles.ACTIVE,
      icon: icons.CHAT,
      onPress: () => this.doOpenChat(navigation)
    })

    let sections = supportStore.faqCategories.map((faqCategory) => {

      let data = []
      if (this.section === faqCategory.reference) {
        data = faqCategory.faqs.map(faq => { return { ...faq } })
      }
      return { ...faqCategory, isOpen: data.length > 0, data: data }
    })

    return (
      <Container>
        <NavigationEvents onWillFocus={payload => { this.onLoad(payload) }} />
        <HeaderComponent t={t} navigation={navigation} title={t('support:supportTitle')} currentScreen={screens.SUPPORT_FAQS} />
        <Content padder>
          <SectionList
            onRefresh={this.doRefresh}
            refreshing={this.refreshing}
            renderItem={this.renderItem}
            renderSectionHeader={this.renderSection}
            sections={sections}
            keyExtractor={(item, index) => item + index}
          />
        </Content>
        <ActionBarComponent actions={actions} />
      </Container>
    );
  }
}
export default translate("translations")(SupportFaqsScreen);
