import React from "react";
import FastImage from 'react-native-fast-image'
import { Image } from 'react-native'
import { SAVE_TOKEN } from '../../utils/api'
import configurations from "../../utils/configurations"

export default class UFOImage extends React.Component {

    render() {

        let style = this.props.style
        let resizeMode = this.props.resizeMode ? this.props.resizeMode : 'cover'
        let source = this.props.source

        if (source.uri && source.uri === 'loading') {
            return (
                <FastImage source={require('../../assets/images/loading.gif')} style={style} resizeMode={resizeMode} >
                    {this.props.children}
                </FastImage >

            );
        }

        if (source.reference) {
            let url = configurations.UFO_SERVER_API_URL + "api/" + configurations.UFO_SERVER_API_VERSION + "/documents/" + source.reference
            let header = { Authorization: 'Bearer ' + SAVE_TOKEN }
            return (
                <FastImage source={{
                    uri: url,
                    headers: header,
                    priority: FastImage.priority.normal
                }}
                    style={style} resizeMode={resizeMode}>
                    {this.props.children}
                </FastImage>
            )
        }

        if (source.uri) {
            source.headers = {} //TODO add authentication if we secure resources
            source.priority = FastImage.priority.normal
            return (

                <FastImage source={source} style={style} resizeMode={resizeMode} >
                    {this.props.children}
                </FastImage>

            );
        }

        return <Image source={source} style={style} resizeMode={resizeMode} />
    }
}