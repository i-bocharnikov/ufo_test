import React, { Component } from 'react';
import { View, ScrollView, Text, Animated, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { UFOIcon } from './../common';
import styles, { HEADER_HEIGHT, TITLE_FONT_SIZE, BACK_ICON_SIZE } from './styles/navBarStyles';
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
      backBtnAction,
      backgroundWrapper,
      children
    } = this.props;
    const hasSubtitle = subtitle || SubtitleComponent;

    return (
      <View style={[ styles.wrapper, backgroundWrapper && { backgroundColor: backgroundWrapper } ]}>
        <View style={[ styles.headerContainer, styles.headerShadow ]}>
          <Animated.View style={[
            styles.header,
            { height: isCollapsible ? this.getHeaderHeight() : HEADER_HEIGHT }
          ]}
          >
            {backBtnAction && (
              <TouchableOpacity
                onPress={backBtnAction}
                style={styles.backBtn}
                activeOpacity={values.BTN_OPACITY_DEFAULT}
              >
                <UFOIcon
                  name="keyboard-backspace"
                  iconPack="MaterialCommunity"
                  animated={true}
                  style={[
                    styles.backIcon,
                    { fontSize: isCollapsible ? this.getBackIconSize() : BACK_ICON_SIZE }
                  ]}
                />
              </TouchableOpacity>
            )}
            <Animated.Text style={[
              styles.title,
              { fontSize: isCollapsible ? this.getHeaderTitleSize() : TITLE_FONT_SIZE }
            ]}
            >
              {title}
            </Animated.Text>
          </Animated.View>
          {hasSubtitle && (
            <View style={styles.subHeader}>
              {SubtitleComponent
                ? SubtitleComponent
                : <Text style={[ styles.subTitle, styles.subTitleCenter ]}>{subtitle}</Text>
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

  getBackIconSize = () => this.state.scrollY.interpolate({
    inputRange: [ 0, HEADER_HEIGHT ],
    outputRange: [ BACK_ICON_SIZE, 0 ],
    extrapolate: 'clamp'
  });

  scrollToTop = () => {
    if (this.scrollView) {
      this.scrollView.scrollTo({ x: 0, animated: false });
    }
  }
}

UFONavBarWrapper.defaultProps = { isCollapsible: true };

UFONavBarWrapper.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  SubtitleComponent: PropTypes.node,
  isCollapsible: PropTypes.bool,
  backBtnAction: PropTypes.func,
  backgroundWrapper: PropTypes.string
};
