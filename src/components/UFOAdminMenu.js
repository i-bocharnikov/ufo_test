import React, { Component } from 'react';
import { observer } from "mobx-react";

import { View, StyleSheet, ScrollView } from 'react-native'
import Touchable from 'react-native-platform-touchable';
import otaKeyStore from '../stores/otaKeyStore'
import { UFOText } from './common'

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

        otaKeyStore.otaLog = " "
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
                <UFOText inverted style={styles.menuItemText}>{text}</UFOText>
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
                ><View /></Touchable>
            );
        }

        const buttons = [
            this.renderMenuItem('Clear logs', this.clearLogs),
            this.renderMenuItem('Cancel', this.closeMenu)
        ];

        return (
            <View style={{ flex: 1, flexDirection: "column", justifyContent: 'flex-start', alignContent: 'flex-start', backgroundColor: 'black' }}>

                <ScrollView style={{ flex: 1 }}>
                    <UFOText inverted log>
                        {otaKeyStore.otaLog}
                    </UFOText>
                </ScrollView>
                <View style={styles.menu}>
                    {buttons}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    circle: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'black'
    },
    menu: {
        backgroundColor: 'black',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
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

export default UFOAdminMenu;
