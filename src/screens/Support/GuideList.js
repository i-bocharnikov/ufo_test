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
    >
      {supportStore.guideCategories.map(category => (
        <TouchableOpacity
          key={category.reference}
          onPress={() => this.onCategoryPress(category.reference)}
          activeOpacity={values.BTN_OPACITY_DEFAULT}
        >
          <Text>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  renderGuideItem = ({ item }) => (
    <Text>
      {item.title}
    </Text>
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
}

export default translate()(GuideListScreen);
