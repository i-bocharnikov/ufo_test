import React, { Component } from 'react';
import { ScrollView, View, Text, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';

import { supportStore } from './../../stores';
import screenKeys from './../../navigators/helpers/screenKeys';
import { UFOContainer, UFOIcon } from './../../components/common';
import styles from './styles';
import { values } from './../../utils/theme';

@observer
class GuideListScreen extends Component {
  @observable refreshing = false;

  defaultCategoryTag = { name: this.props.t('guideAllCategory') };

  render() {
    return (
      <UFOContainer style={styles.container}>
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              onRefresh={this.refreshData}
              refreshing={this.refreshing}
            />
          }
          data={supportStore.guideList}
          renderItem={this.renderGuideItem}
          keyExtractor={this.guideListKeyExtractor}
          ListHeaderComponent={this.renderGuideTags()}
        />
      </UFOContainer>
    );
  }

  renderGuideTags = () => (
    <ScrollView
      horizontal={true}
      contentContainerStyle={styles.guideTagsContainer}
      showsHorizontalScrollIndicator={false}
    >
      {this.renderTagItem(
        this.defaultCategoryTag,
        !supportStore.chosenCategoryRef,
        true
      )}
      {supportStore.guideCategories.map((category, i, collection) => this.renderTagItem(
        category,
        supportStore.chosenCategoryRef === category.reference,
        false,
        (i === collection.length - 1)
      ))}
    </ScrollView>
  );

  renderTagItem = (category, isChoosen, isFirst, isLast) => (
    <TouchableOpacity
      key={category.reference}
      onPress={() => this.onCategoryPress(category.reference)}
      activeOpacity={values.BTN_OPACITY_DEFAULT}
      style={[
        styles.guideTagBtn,
        styles.blockShadow,
        isFirst && styles.guideTagBtnFirst,
        isLast && styles.guideTagBtnLast,
        isChoosen && styles.guideTagBtnChosen
      ]}
    >
      <Text style={[
        styles.guideTagLabel,
        isChoosen && styles.guideTagLabelChosen
      ]}>
        {category.name.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  renderGuideItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => this.onGuidePress(item)}
      activeOpacity={values.BTN_OPACITY_DEFAULT}
      style={styles.guideItem}
    >
      <Text style={styles.guideItemLabel}>
        {item.title}
      </Text>
      <UFOIcon style={styles.guideItemIcon} name="md-right" />
    </TouchableOpacity>
  );

  guideListKeyExtractor = item => `${item.reference}${item.title}`;

  refreshData = async () => {
    this.refreshing = true;
    await supportStore.fetchGuides();
    this.refreshing = false;
  };

  onCategoryPress = ref => {
    if (!ref || ref === supportStore.chosenCategoryRef) {
      supportStore.chosenCategoryRef = null;
    } else {
      supportStore.chosenCategoryRef = ref;
    }
  };

  onGuidePress = guide => {
    console.log('GUIDE PRESS', guide);
  };
}

export default translate('support')(GuideListScreen);
