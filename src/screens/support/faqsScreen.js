import React, { Component } from 'react';
import { SectionList, View, Text, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import { NavigationEvents } from 'react-navigation';
import Touchable from 'react-native-platform-touchable';
import call from 'react-native-phone-call';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import {
  UFOContainer,
  UFOText,
  UFOIcon_old,
  UFOImage
} from './../../components/common';
import {
  actionStyles,
  icons,
  colors,
  sizes,
  navigationParams,
  screens
} from './../../utils/global';
import supportStore from './../../stores/supportStore';
import { driveStore } from './../../stores';
import userActionsLogger, {
  severityTypes,
  codeTypes
} from '../../utils/userActionsLogger';

const SUPPORT_FAQ = navigationParams.SUPPORT_FAQ;
const SUPPORT_FAQ_CATEGORY = navigationParams.SUPPORT_FAQ_CATEGORY;

const styles = StyleSheet.create({
  faqList: {
    paddingTop: 12,
    paddingHorizontal: 20
  },
  sectionWrapper: { paddingTop: 20 },
  sectionBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.ACTIVE.string(),
    borderRadius: 5
  },
  sectionicon: { textAlignVertical: 'center' },
  itemBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 4,
    backgroundColor: colors.CARD_BACKGROUND.string()
  },
  itemIcon: { marginLeft: 4 }
});

/* used for old UFOText which accept only raw styles object */
const stylesDepreated = { itemLabel: { flex: 1 } };

@observer
class SupportFaqsScreen extends Component {
  @observable refreshing = false;
  @observable section = null;

  render() {
    const { t, navigation } = this.props;
    const actions = [];

    actions.push({
      style: actionStyles.ACTIVE,
      icon: icons.BACK,
      onPress: () => this.doBack(navigation)
    });

    if (driveStore.emergencyNumber) {
      actions.push({
        style: actionStyles.TODO,
        icon: icons.EMERGENCY_CALL,
        onPress: () => this.doCall(driveStore.emergencyNumber)
      });
    }

    actions.push({
      style: actionStyles.ACTIVE,
      icon: icons.CHAT,
      onPress: () => this.doOpenChat()
    });

    const sections = supportStore.faqCategories.map(faqCategory => {
      let data = [];
      if (this.section === faqCategory.reference) {
        data = faqCategory.faqs.map(faq => {
          return { ...faq };
        });
      }
      return { ...faqCategory, isOpen: data.length > 0, data: data };
    });

    return (
      <UFOContainer image={screens.SUPPORT_FAQS.backgroundImage}>
        <NavigationEvents onWillFocus={this.onLoad} />
        <UFOHeader
          t={t}
          navigation={navigation}
          title={t('support:supportTitle')}
          currentScreen={screens.SUPPORT_FAQS}
        />
        <SectionList
          onRefresh={this.doRefresh}
          refreshing={this.refreshing}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSection}
          sections={sections}
          keyExtractor={item => item.reference}
          contentContainerStyle={styles.faqList}
          bounces={false}
        />
        <UFOActionBar actions={actions} />
      </UFOContainer>
    );
  }

  renderSection = ({ section: { reference, name, isOpen } }) => (
    <View style={styles.sectionWrapper}>
      <Touchable onPress={() => this.onPressSection(reference)}>
        <View style={styles.sectionBody}>
          <UFOText h3 inverted>
            {name}
          </UFOText>
          <UFOIcon_old
            icon={isOpen ? icons.SEGMENT_OPEN : icons.SEGMENT_CLOSE}
            size={sizes.SMALL}
            style={styles.sectionicon}
          />
        </View>
      </Touchable>
    </View>
  );

  renderItem = ({ item: { reference, title }, index, section }) => (
    <Touchable onPress={() => this.onPressItem(section.reference, reference)}>
      <View style={styles.itemBody}>
        <UFOText style={stylesDepreated.itemLabel}>{title}</UFOText>
        <UFOIcon_old
          style={styles.itemIcon}
          inverted
          icon={icons.NEXT}
          size={sizes.SMALL}
        />
      </View>
    </Touchable>
  );

  onLoad = async payload => {
    if (payload && payload.state && payload.state.routeName !== 'SupportFaqs') {
      return;
    }
    //await this.doRefresh();
  };

  onPressSection = reference => {
    if (this.section === reference) {
      this.section = null;
    } else {
      this.section = reference;
    }
  };

  onPressItem = (sectionReference, reference) => {
    this.props.navigation.navigate(screens.SUPPORT_FAQ.name, {
      SUPPORT_FAQ_CATEGORY: sectionReference,
      SUPPORT_FAQ: reference
    });
  };

  doRefresh = async () => {
    return await supportStore.list();
  };

  doBack = async navigation => {
    this.props.navigation.navigate(
      navigation.getParam(navigationParams.PREVIOUS_SCREEN, screens.HOME).name
    );
  };

  doOpenChat = () => {
    userActionsLogger(
      severityTypes.INFO,
      codeTypes.SUCCESS,
      'openChat',
      '',
      ''
    );
    this.props.navigation.navigate(screens.SUPPORT_CHAT.name);
  };

  doCall = async number => {
    call({
      number: number,
      prompt: false
    });
  };
}

export default translate('translations')(SupportFaqsScreen);
