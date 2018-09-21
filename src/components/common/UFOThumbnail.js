import React from "react";
import { Thumbnail } from 'native-base';

import CaptureImage from '../../assets/UFOCamera.png'
import LoadingImage from '../../assets/loading.png'


export default class UFOThumbnail extends React.Component {
    render() {

        let source = this.props.source ? this.props.source : null
        if (source) {
            if (source === 'loading') {
                return (
                    <Thumbnail square source={LoadingImage} small />
                );
            }
            return (
                <Thumbnail square source={{ uri: source }} small />
            );
        }
        return (
            <Thumbnail square source={CaptureImage} small />
        )
    }
}