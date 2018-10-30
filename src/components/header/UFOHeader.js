import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { UFOText, UFOImage } from './../common';
import {
    colors,
    icons,
    actionStyles,
    screens,
    sizes,
    logos
} from './../../utils/global';
import UFOAction from './../UFOAction';
import styles from './styles';

@observer
export default class UFOHeader extends Component {
    render() {
        const {
            t,
            transparent,
            currentScreen = screens.HOME,
        } = this.props;


        const title = this.props.title ? (<UFOText inverted h3>{this.props.title}</UFOText>) : null


        const logo = this.props.logo ? (<UFOImage source={logos.horizontal} style={styles.logo} resizeMode='contain' />) : null

        const alpha = transparent ? 0 : 0.7;
        const isSupport = currentScreen.supportFaqCategory !== null;

        const activities = activitiesStore.activities
        let activitiesMessage = null
        if (activities.internetAccessFailure && activities.bluetoothAccessFailure) {
            activitiesMessage = t('activities:internetbluetoothAccessFailure')
        } else if (activities.internetAccessFailure) {
            activitiesMessage = t('activities:internetAccessFailure')
        } else if (activities.bluetoothAccessFailure) {
            activitiesMessage = t('activities:bluetoothAccessFailure')
        }

        return (
            <View style={styles.headerMasterContainer}>
                {activitiesMessage && (
                    <View style={styles.activityMessages}>
                        <UFOText h11 inverted center>
                            {activitiesMessage}
                        </UFOText>
                    </View>
                )}
                <View style={[
                    styles.headerContainer,
                    {backgroundColor: colors.HEADER_BACKGROUND.alpha(alpha).string()}
                ]}>
                    <View style={styles.left}>
                        <UFOAction
                            action={{
                                style: actionStyles.ACTIVE,
                                icon: icons.HOME,
                                onPress: this.goToHome
                            }}
                            size={sizes.SMALL}
                            noText
                        />
                    </View>
                    <View style={styles.body}>
                        {title}
                        {logo}
                    </View>
                    <View style={styles.right}>
                        {(isSupport &&
                            <UFOAction
                                action={{
                                    style: actionStyles.TODO,
                                    icon: icons.HELP,
                                    onPress: () => this.goToSupport(currentScreen)
                                }}
                                size={sizes.SMALL}
                                noText
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    }

    goToHome = () => {
        this.props.navigation.navigate(screens.HOME.name);
    };

    goToSupport = currentScreen => {
        this.props.navigation.navigate(
            screens.SUPPORT_FAQS.name,
            {
                SUPPORT_FAQ_CATEGORY: currentScreen.supportFaqCategory,
                PREVIOUS_SCREEN: currentScreen
            }
        );
    };
}

UFOHeader.propTypes = {

};
