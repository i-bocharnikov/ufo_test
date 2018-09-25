import React from "react";
import { View, TouchableOpacity } from 'react-native';
import { translate } from "react-i18next";

import { UFOText, UFOIcon } from './common'
import { actionStyles, colors, icons, sizes } from '../utils/global'

class UFOActionBar extends React.Component {
    render() {

        const { t } = this.props;
        let actions = this.props.actions ? this.props.actions : []
        let bottom = this.props.bottom ? this.props.bottom : 20
        return (
            <View style={{
                position: 'absolute',
                bottom: bottom,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                height: 100,
                width: '100%',
            }}>
                {actions.map((action, index) => {

                    let style = action.style ? action.style : actionStyles.WRONG
                    let color = style.color ? style.color : colors.WRONG
                    let elevation = style.elevation ? style.elevation : 0
                    let icon = action.icon ? action.icon : icons.WRONG
                    return (
                        <TouchableOpacity
                            key={index}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onPress={action.onPress}
                            action={action}
                            disabled={style === actionStyles.DISABLE}
                        >
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 50,
                                height: 50,
                                backgroundColor: color.string(),
                                borderRadius: 100,
                                elevation: elevation
                            }}>
                                <UFOIcon icon={icon} size={sizes.LARGE} />
                            </View>
                            <UFOText inverted style={{ fontWeight: 'bold' }}>{t(icon.i18nKey)}</UFOText>
                        </TouchableOpacity>
                    )
                }
                )}
            </View>
        );
    }
}


export default translate("translations")(UFOActionBar);