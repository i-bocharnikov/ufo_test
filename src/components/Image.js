import React from "react";
import FastImage from 'react-native-fast-image'
import Image from 'react-native'

export default class ImageComponent extends React.Component {

    render() {

        let style = this.props.style
        let resizeMode = this.props.resizeMode ? this.props.resizeMode : 'cover'
        let source = this.props.source
        if (source.uri) {
            source.headers = {} //TODO add authentication if we secure resources
            source.priority = FastImage.priority.normal
            return (
                <FastImage source={source} style={style} resizeMode={resizeMode} />
            );
        } else {
            return <Image source={source} style={style} resizeMode={resizeMode} />
        }

    }
}