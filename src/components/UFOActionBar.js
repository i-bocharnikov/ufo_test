import React from "react";
import { View, StyleSheet, Keyboard, Animated } from 'react-native';
import { translate } from "react-i18next";

import UFOAction from "./UFOAction";

const ACTION_BAR_HEIGTH = 90

class UFOActionBar extends React.Component {

    state = {
        fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
        bottomAnimatedPosition: new Animated.Value(0),  // Initial value for opacity: 0
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 1,                   // Animate to opacity: 1 (opaque)
                duration: 500,              // Make it take a while
            }
        ).start();
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        Animated.timing(                  // Animate over time
            this.state.fadeAnim,            // The animated value to drive
            {
                toValue: 0,                   // Animate to opacity: 1 (opaque)
                duration: 500,              // Make it take a while
            }
        ).start();
    }

    keyboardDidShow = (event) => {
        console.log("************", event)
        Animated.timing(
            this.state.bottomAnimatedPosition,
            {
                toValue: event.endCoordinates.height,
                duration: 500,
            }
        ).start();
    };

    keyboardDidHide = () => {
        Animated.timing(
            this.state.bottomAnimatedPosition,
            {
                toValue: 0,
                duration: 500,
            }
        ).start();
    };

    render() {

        const { t } = this.props;
        let { fadeAnim, bottomAnimatedPosition } = this.state;
        let actions = this.props.actions ? this.props.actions : []
        let moveUp = this.props.moveUp ? this.props.moveUp : 0
        let activityPending = this.props.activityPending ? this.props.activityPending : false
        let inverted = this.props.inverted ? this.props.inverted : false
        return (
            <Animated.View style={[styles.actionBarContainer, { bottom: bottomAnimatedPosition, opacity: fadeAnim }]}>
                <View style={styles.actionBar}>
                    {actions.map((action, index) => (
                        <UFOAction action={action} key={index} activityPending={activityPending} inverted={inverted} />
                    ))}
                </View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    actionBarContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: ACTION_BAR_HEIGTH,
        backgroundColor: 'transparent'
    },
    actionBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start'
    },
});

export default translate("translations")(UFOActionBar);