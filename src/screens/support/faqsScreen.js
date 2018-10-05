import React, { Component } from "react";
import { translate } from "react-i18next";
import { NavigationEvents } from 'react-navigation';
import { View } from 'react-native'
import Touchable from 'react-native-platform-touchable';
import { observer } from "mobx-react";
import { observable } from "mobx";
import { KeyboardAwareSectionList } from "react-native-keyboard-aware-scroll-view";
import call from 'react-native-phone-call'

import UFOHeader from "../../components/header/UFOHeader";
import UFOActionBar from "../../components/UFOActionBar";
import { UFOContainer, UFOText, UFOIcon, UFOImage } from '../../components/common'
import { actionStyles, icons, colors, sizes, navigationParams, screens } from '../../utils/global'
import supportStore from "../../stores/supportStore";
import { driveStore } from "../../stores";

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
    this.section = this.props.navigation.getParam(navigationParams.SUPPORT_FAQ_CATEGORY, this.section);
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
    <View style={{ paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
      <Touchable
        key={reference}
        onPress={() => this.onPressSection(reference)}>
        <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', backgroundColor: colors.ACTIVE.string(), borderRadius: 5 }}>
          <UFOText h3 inverted>{name}</UFOText>
          <UFOIcon icon={isOpen ? icons.SEGMENT_OPEN : icons.SEGMENT_CLOSE} size={sizes.SMALL} />
        </View>
      </Touchable >
    </View>
  )

  renderItem = ({ item: { reference, title }, index, section }) => (
    <View style={{ paddingHorizontal: 20, }}>
      <Touchable
        key={reference}
        onPress={() => this.onPressItem(section.reference, reference)}>
        <View style={{ backgroundColor: colors.CARD_BACKGROUND.string(), paddingHorizontal: 10, paddingVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', }}>
          <UFOText style={{ flex: 0.95 }}>{title}</UFOText>
          <UFOIcon style={{ flex: 0.05 }} inverted icon={icons.NEXT} size={sizes.SMALL} />
        </View>
      </Touchable >
    </View>
  )


  render() {
    const { t, navigation } = this.props;


    let actions = []

    actions.push({
      style: actionStyles.ACTIVE,
      icon: icons.HOME,
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
      <UFOContainer image={screens.SUPPORT_FAQS.backgroundImage}>
        <NavigationEvents onWillFocus={payload => { this.onLoad(payload) }} />
        <UFOHeader t={t} navigation={navigation} title={t('support:supportTitle')} currentScreen={screens.SUPPORT_FAQS} />
        <KeyboardAwareSectionList
          onRefresh={this.doRefresh}
          refreshing={this.refreshing}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSection}
          sections={sections}
          keyExtractor={(item, index) => item.reference}
        />
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }
}
export default translate("translations")(SupportFaqsScreen);
