import React, { Component } from 'react';
import { View, ScrollView, Text, Animated, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { UFOIcon_next } from './../common';
import styles, { HEADER_HEIGHT, TITLE_FONT_SIZE, BACK_ICON_SIZE } from './styles/navBarStyles';

export default class UFONavBarWrapper extends Component {
  constructor() {
    super();
    this.state = {
      scrollY: new Animated.Value(0)
    };
  }

  render() {
    const {
      title,
      subtitle,
      subtitleComponent,
      isCollapsible,
      backBtnAction,
      children
    } = this.props;
    const hasSubtitle = subtitle || subtitleComponent;

    return (
      <View style={styles.wrapper}>
        <View style={styles.headerContainer}>
          <Animated.View style={[
            styles.header,
            {height: isCollapsible ? this.getHeaderHeight() : HEADER_HEIGHT}
          ]}>
            {backBtnAction && (
              <TouchableOpacity
                onPress={backBtnAction}
                style={styles.backBtn}
                activeOpacity={0.6}
              >
                <UFOIcon_next
                  name="keyboard-backspace"
                  iconPack="MaterialCommunity"
                  animated={true}
                  style={[
                    styles.backIcon,
                    {fontSize: isCollapsible ? this.getBackIconSize() : BACK_ICON_SIZE}
                  ]}
                />
              </TouchableOpacity>
            )}
            <Animated.Text style={[
              styles.title,
              {fontSize: isCollapsible ? this.getHeaderTitleSize() : TITLE_FONT_SIZE}
            ]}>
              {title}
            </Animated.Text>
          </Animated.View>
          {hasSubtitle && (
            <View style={styles.subHeader}>
              <Text style={styles.subTitle}>
                {subtitle || subtitleComponent}
              </Text>
            </View>
          )}
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          onScroll={Animated.event([
            {nativeEvent: {contentOffset: {y: this.state.scrollY}}},
          ])}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  getHeaderHeight = () => this.state.scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT, 0],
    extrapolate: 'clamp'
  });

  getHeaderTitleSize = () => this.state.scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [TITLE_FONT_SIZE, 0],
    extrapolate: 'clamp'
  });

  getBackIconSize = () => this.state.scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [BACK_ICON_SIZE, 0],
    extrapolate: 'clamp'
  });
}

UFONavBarWrapper.defaultProps = {
  isCollapsible: true
};

UFONavBarWrapper.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  subtitleComponent: PropTypes.node,
  isCollapsible: PropTypes.bool,
  backBtnAction: PropTypes.func
};
