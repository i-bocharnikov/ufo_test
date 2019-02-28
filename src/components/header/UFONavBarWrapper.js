import React, { Component } from 'react';
import { View, ScrollView, Text, Animated, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import { UFOIcon } from './../common';
import styles, { HEADER_HEIGHT, TITLE_FONT_SIZE, ACTION_ICON_SIZE } from './styles/navBarStyles';
import { values } from './../../utils/theme';

export default class UFONavBarWrapper extends Component {
  constructor() {
    super();
    this.state = { scrollY: new Animated.Value(0) };
  }

  render() {
    const {
      title,
      subtitle,
      SubtitleComponent,
      isCollapsible,
      backgroundWrapper,
      stylesHeader,
      children
    } = this.props;
    const hasSubtitle = subtitle || SubtitleComponent;

    return (
      <View style={[
        styles.wrapper,
        backgroundWrapper && { backgroundColor: backgroundWrapper }
      ]}>
        <View style={[ styles.headerContainer, styles.headerShadow, stylesHeader ]}>
          <Animated.View style={[
            styles.header,
            { height: isCollapsible ? this.getHeaderHeight() : HEADER_HEIGHT }
          ]}>
            {this.renderLeftBtn()}
            <Animated.Text style={[
              styles.title,
              { fontSize: isCollapsible ? this.getHeaderTitleSize() : TITLE_FONT_SIZE }
            ]}>
              {title}
            </Animated.Text>
            {this.renderRightBtn()}
          </Animated.View>
          {hasSubtitle && (
            <View style={styles.subHeader}>
              {SubtitleComponent
                ? SubtitleComponent
                : <Text style={[ styles.subTitle, styles.subTitleCenter ]} numberOfLines={1}>{subtitle}</Text>
              }
            </View>
          )}
        </View>
        <ScrollView
          contentContainerStyle={hasSubtitle ? styles.containerWithSubtitle : styles.container}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          ref={ref => (this.scrollView = ref)}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  renderLeftBtn() {
    const { isCollapsible, leftBtnAction, leftBtnIcon } = this.props;

    if (!leftBtnAction) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={leftBtnAction}
        style={styles.leftBtn}
        activeOpacity={values.BTN_OPACITY_DEFAULT}
      >
        <UFOIcon
          name={leftBtnIcon}
          iconPack="MaterialCommunity"
          animated={true}
          style={[
            styles.actionIcon,
            { fontSize: isCollapsible ? this.getActionIconSize() : ACTION_ICON_SIZE }
          ]}
        />
      </TouchableOpacity>
    );
  }

  renderRightBtn() {
    const { isCollapsible, rightBtnAction, rightBtnIcon } = this.props;

    if (!rightBtnAction) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={rightBtnAction}
        style={styles.rightBtn}
        activeOpacity={values.BTN_OPACITY_DEFAULT}
      >
        <UFOIcon
          name={rightBtnIcon}
          iconPack="MaterialCommunity"
          animated={true}
          style={[
            styles.actionIcon,
            { fontSize: isCollapsible ? this.getActionIconSize() : ACTION_ICON_SIZE }
          ]}
        />
      </TouchableOpacity>
    );
  }

  getHeaderHeight = () => this.state.scrollY.interpolate({
    inputRange: [ 0, HEADER_HEIGHT ],
    outputRange: [ HEADER_HEIGHT, 0 ],
    extrapolate: 'clamp'
  });

  getHeaderTitleSize = () => this.state.scrollY.interpolate({
    inputRange: [ 0, HEADER_HEIGHT ],
    outputRange: [ TITLE_FONT_SIZE, 0 ],
    extrapolate: 'clamp'
  });

  getActionIconSize = () => this.state.scrollY.interpolate({
    inputRange: [ 0, HEADER_HEIGHT ],
    outputRange: [ ACTION_ICON_SIZE, 0 ],
    extrapolate: 'clamp'
  });

  scrollToTop = () => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ x: 0, animated: false });
    }
  }
}

UFONavBarWrapper.defaultProps = {
  isCollapsible: true,
  leftBtnIcon: 'keyboard-backspace',
  rightBtnIcon: 'help-circle-outline'
};

UFONavBarWrapper.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  SubtitleComponent: PropTypes.node,
  isCollapsible: PropTypes.bool,
  leftBtnAction: PropTypes.func,
  leftBtnIcon: PropTypes.string,
  rightBtnAction: PropTypes.func,
  rightBtnIcon: PropTypes.string,
  backgroundWrapper: PropTypes.string,
  stylesHeader: ViewPropTypes.style
};
