/*
 * This component is extended implementation of `createBottomTabNavigator` from `react-navigation`
 * because standard api does not provide methods to add transition animation between tabs.
 * For base was taken component used in `react-navigation` v.2.17.0
 * all api was saved, doc for package can be used as usual.
*/

import React, { PureComponent } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { ScreenContainer } from 'react-native-screens';
import { polyfill } from 'react-lifecycles-compat';
import { createTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import ResourceSavingScene from 'react-navigation-tabs/dist/views/ResourceSavingScene';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  pages: {
    flex: 1
  }
});

class TabNavigationView extends PureComponent {
  constructor(props) {
    super(props);
    this.screenOpacity = new Animated.Value(1);
    this.transitionDuration = 250;
    this.state = {
      loaded: [ props.navigation.state.index ],
      activeIndex: props.navigation.state.index
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { index } = nextProps.navigation.state;

    return {
      loaded: prevState.loaded.includes(index) ? prevState.loaded : [ ...prevState.loaded, index ]
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.navigation.state.index !== this.props.navigation.state.index) {
      this._animateTransition();
    }
  }

  render() {
    const { navigation, renderScene, lazy } = this.props;
    const { routes } = navigation.state;
    const { loaded, activeIndex } = this.state;

    return (
      <Animated.View style={[styles.container, { opacity: this.screenOpacity }]}>
        <ScreenContainer style={styles.pages}>
          {routes.map((route, index) => {
            if (lazy && !loaded.includes(index)) {
              return null;
            }

            const isFocused = activeIndex === index;

            return (
              <ResourceSavingScene
                key={route.key}
                style={[StyleSheet.absoluteFill, { opacity: isFocused ? 1 : 0 }]}
                isVisible={isFocused}
              >
                {renderScene({ route })}
              </ResourceSavingScene>
            );
          })}
        </ScreenContainer>
        {this._renderTabBar()}
      </Animated.View>
    );
  }

  _renderTabBar = () => {
    const {
      tabBarComponent: TabBarComponent = BottomTabBar,
      tabBarOptions,
      navigation,
      screenProps,
      getLabelText,
      getAccessibilityLabel,
      getButtonComponent,
      getTestID,
      renderIcon,
      onTabPress
    } = this.props;

    const { descriptors } = this.props;
    const { state } = this.props.navigation;
    const route = state.routes[state.index];
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    if (options.tabBarVisible === false) {
      return null;
    }

    return (
      <TabBarComponent
        {...tabBarOptions}
        jumpTo={this._jumpTo}
        navigation={navigation}
        screenProps={screenProps}
        onTabPress={onTabPress}
        getLabelText={getLabelText}
        getButtonComponent={getButtonComponent}
        getAccessibilityLabel={getAccessibilityLabel}
        getTestID={getTestID}
        renderIcon={renderIcon}
      />
    );
  };

  _jumpTo = key => {
    const { navigation, onIndexChange } = this.props;
    const index = navigation.state.routes.findIndex(route => route.key === key);
    onIndexChange(index);
  };

  _animateTransition = () => {
    const makeVisible = () => Animated.timing(
      this.screenOpacity,
      {
        toValue: 1,
        duration: this.transitionDuration
      }
    ).start();

    const setNewTab = () => this.setState(
      { activeIndex: this.props.navigation.state.index },
      makeVisible
    );

    Animated.timing(
      this.screenOpacity,
      {
        toValue: 0,
        duration: this.transitionDuration
      }
    ).start(setNewTab);
  };
}

TabNavigationView.defaultProps = { lazy: true };
polyfill(TabNavigationView);

export default createTabNavigator(TabNavigationView);
