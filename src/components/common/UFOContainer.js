import React, { Component } from "react";
import { Container } from 'native-base'
import { ImageBackground, Dimensions } from 'react-native'


class UFOContainer extends Component {

    render() {
        let image = this.props.image
        if (image) {
            return (
                <Container style={{ backgroundColor: 'black' }}>
                    <ImageBackground style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }} source={image} resizeMode='cover'>
                        {this.props.children}
                    </ImageBackground>
                </Container>
            );
        }
        return (
            <Container>
                {this.props.children}
            </Container>
        );
    }
}


export default UFOContainer;