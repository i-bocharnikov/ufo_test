import React from "react";
import {
    CachedImage,
} from 'react-native-cached-image';


export default class ImageComponent extends React.Component {

    render() {

        let source = this.props.source
        let style = this.props.style
        let resizeMode = this.props.resizeMode ? this.props.resizeMode : 'cover'
        return (
            <CachedImage source={source} style={style} resizeMode={resizeMode} />
        );
    }
}