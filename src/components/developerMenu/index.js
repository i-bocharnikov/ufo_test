import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet, ScrollView
} from 'react-native';

import otaKeyStore from '../../stores/otaKeyStore'
import { observer } from "mobx-react";

@observer
class DeveloperMenu extends Component {
    static displayName = 'DeveloperMenu';

    constructor(props) {
        super(props);
        this.state = { visible: false };
    }

    showDeveloperMenu = () => {
        this.setState({ isVisible: true });
    };

    clearLogs = async () => {

        otaKeyStore.otaLog = ""
        this.closeMenu();
    };

    closeMenu = () => {
        this.setState({ isVisible: false });
    };

    renderMenuItem(text, onPress) {
        return (
            <TouchableOpacity
                key={text}
                onPress={onPress}
                style={styles.menuItem}
            >
                <Text style={styles.menuItemText}>{text}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        if (!__DEV__) {
            return null;
        }

        if (!this.state.isVisible) {
            return (
                <TouchableOpacity
                    style={styles.circle}
                    onPress={this.showDeveloperMenu}
                />
            );
        }

        const buttons = [
            this.renderMenuItem('Clear logs', this.clearLogs),
            this.renderMenuItem('Cancel', this.closeMenu)
        ];

        return (
            <View style={{ flex: 1, flexDirection: "column", justifyContent: 'flex-start', alignContent: 'flex-start' }}>

                <ScrollView style={{ flex: 1, }}>
                    <Text style={{ alignSelf: 'flex-start', fontSize: 10, color: 'black' }}>
                        {otaKeyStore.otaLog}
                    </Text>
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
        backgroundColor: '#fff'
    },
    menu: {
        backgroundColor: 'white',
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
        borderTopColor: '#eee',
        padding: 10,
        height: 60
    },
    menuItemText: {
        fontSize: 20
    }
});

export default DeveloperMenu;
