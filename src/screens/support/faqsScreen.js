import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Content, Text } from 'native-base';
import { SectionList, View, TouchableHighlight } from 'react-native'
import { observer } from "mobx-react";
import { observable } from "mobx";


import HeaderComponent from "../../components/header";
import ActionBarComponent from '../../components/actionBar'
import Icon from '../../components/Icon'
import { actionStyles, icons, colors, sizes, navigationParams, screens } from '../../utils/global'
import supportStore from "../../stores/supportStore";

const SUPPORT_FAQ = navigationParams.SUPPORT_FAQ

@observer
class SupportFaqsScreen extends Component {

  @observable
  refreshing = false

  @observable
  section = null


  componentDidMount() {

    this.doRefresh()
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

  onPressItem = (reference) => {
    console.log("GO to detail ", reference)
    this.props.navigation.navigate(screens.SUPPORT_FAQ, { SUPPORT_FAQ: reference })
  }

  doRefresh = async () => { return await supportStore.list() }

  renderSection = ({ section: { reference, name, isOpen } }) => (
    <TouchableHighlight
      key={reference}
      onPress={() => this.onPressSection(reference)}>
      <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', backgroundColor: colors.ACTIVE.string(), borderRadius: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>{name}</Text>
        <Icon icon={isOpen ? icons.SEGMENT_OPEN : icons.SEGMENT_CLOSE} size={sizes.SMALL} color={colors.TEXT} />
      </View>
    </TouchableHighlight >
  )

  renderItem = ({ item: { reference, title }, index, section }) => (
    <TouchableHighlight
      key={reference}
      onPress={() => this.onPressItem(reference)}>
      <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', }}>
        <Text style={{}}>{title}</Text>
        <Icon icon={icons.NEXT} size={sizes.SMALL} color={colors.TEXT} />
      </View>
    </TouchableHighlight >
  )


  render() {
    const { t, navigation } = this.props;

    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.pop()
      },
    ]

    let sections = supportStore.faqCategories.map((faqCategory) => {

      let data = []
      if (this.section === faqCategory.reference) {
        data = faqCategory.faqs.map(faq => { return { ...faq } })
      }
      return { ...faqCategory, isOpen: data.length > 0, data: data }
    })

    return (
      <Container>
        <HeaderComponent t={t} navigation={navigation} title={t('support:supportTitle')} />
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
