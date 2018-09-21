import React from "react";
import { View, TouchableOpacity } from 'react-native';
import { translate } from "react-i18next";

import { sizes, actionStyles, colors, icons } from '../../utils/global'
import { UFOIcon } from '../common'


class UFOActionHeader extends React.Component {


    missing = () => console.error('missing')

    render() {

        const { t } = this.props;
        let actionStyle = this.props.actionStyle ? this.props.actionStyle : actionStyles.WRONG
        let color = actionStyle.color ? actionStyle.color : colors.WRONG
        let icon = this.props.icon ? this.props.icon : icons.WRONG
        let onPress = this.props.onPress ? this.props.onPress : missing

        return (

            <TouchableOpacity
                style={{
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onPress={onPress}
            >
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 30,
                    height: 30,
                    backgroundColor: color.string(),
                    borderRadius: 40,
                    elevation: actionStyle.elevation
                }}>
                    <UFOIcon icon={icon} size={sizes.SMALL} />
                </View>
            </TouchableOpacity>

        );
    }
}


export default translate("translations")(UFOActionHeader);