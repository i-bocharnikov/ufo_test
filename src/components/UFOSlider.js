import React from "react";
import { translate } from "react-i18next";
import { Dimensions, } from 'react-native'
import Carousel from 'react-native-snap-carousel';

import { UFOText } from './common'

const UFOSLIDER_DEVICE_WIDTH = Dimensions.get('window').width
const UFOSLIDER_WIDTH = UFOSLIDER_DEVICE_WIDTH * 90 / 100

class UFOSlider extends React.Component {

    renderItem({ item, index }) {
        return (
            <UFOText>Missing item renderer</UFOText>
        );
    }

    render() {

        const { t } = this.props;
        let data = this.props.data ? this.props.data : []
        let renderItem = this.props.renderItem ? this.props.renderItem : this.renderItem
        let onSnapToItem = this.props.onSnapToItem ? this.props.onSnapToItem : (slideIndex) => { console.log("onSnapToItem to " + slideIndex + " unimplemented do ignored") }
        let firstItem = this.props.firstItem ? this.props.firstItem : 0
        let sliderWidth = UFOSLIDER_DEVICE_WIDTH
        let itemWidth = UFOSLIDER_WIDTH

        return (
            <Carousel
                ref={(c) => { this.carousel = c; }}
                data={data}
                firstItem={firstItem}
                renderItem={renderItem}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                inactiveSlideScale={0.94}
                inactiveSlideOpacity={0.7}
                onSnapToItem={onSnapToItem}
            />
        );
    }
}


export default translate("translations")(UFOSlider);