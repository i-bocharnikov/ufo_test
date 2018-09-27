import React from "react";
import Video from 'react-native-video'

export default class UFOVideo extends React.Component {

    render() {

        let style = this.props.style
        let resizeMode = this.props.resizeMode ? this.props.resizeMode : 'cover'
        let source = this.props.source



        return <Video source={source}
            ref={(ref) => {
                this.player = ref
            }}
            style={style}
            resizeMode={resizeMode}
            repeat={true}
            paused={false}
            muted={false}
        />
    }
}