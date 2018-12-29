import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { View, StyleSheet, ScrollView } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import otaKeyStore from '../stores/otaKeyStore';
import { UFOText } from './common';

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'black'
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    backgroundColor: 'black'
  },
  menu: { flexDirection: 'row', justifyContent: 'space-evenly', alignContent: 'center' },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'white',
    padding: 10,
    height: 60
  },
  menuItemText: {
    fontSize: 20,
    color: 'white'
  }
});

@observer
class UFOAdminMenu extends Component {
  static displayName = 'UFOAdminMenu';

  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  showDeveloperMenu = () => {
    this.setState({ isVisible: true });
  };

  clearLogs = async () => {
    otaKeyStore.otaLog = ' ';
  };

  closeMenu = () => {
    this.setState({ isVisible: false });
  };

  renderMenuItem(text, onPress) {
    return (
      <Touchable
        key={text}
        onPress={onPress}
        style={styles.menuItem}
      >
        <UFOText
          inverted
          style={styles.menuItemText}
        >
          {text}
        </UFOText>
      </Touchable>
    );
  }

  render() {
    if (!__DEV__) {
      return null;
    }

    if (!this.state.isVisible) {
      return (
        <Touchable
          style={styles.circle}
          onPress={this.showDeveloperMenu}
        >
          <View />
        </Touchable>
      );
    }

    const buttons = [
      this.renderMenuItem('Clear', this.clearLogs),
      this.renderMenuItem('Close', this.closeMenu)
    ];

    return (
      <View style={styles.container}>
        <View style={styles.menu}>{buttons}</View>
        <ScrollView style={{ maxHeight: 500 }}>
          <UFOText
            inverted
            log
            disable={true}
          >
            {otaKeyStore.otaLog}
          </UFOText>
        </ScrollView>
      </View>
    );
  }
}

export default UFOAdminMenu;
