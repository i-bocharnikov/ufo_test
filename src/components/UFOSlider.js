import React from "react";
import { translate } from "react-i18next";
import { Dimensions, } from 'react-native'
import Carousel from 'react-native-snap-carousel';


import { UFOText, UFOIcon } from './common'
import { actionStyles, colors, icons, sizes } from '../utils/global'

const DEVICE_WIDTH = Dimensions.get('window').width

class UFOSliderBar extends React.Component {

    _renderItem({ item, index }) {
        return (
            <UFOText>Missing item renderer</UFOText>
        );
    }

    render() {

        const { t } = this.props;
        let data = this.props.data ? this.props.data : []
        let renderItem = this.props.renderItem ? this.props.renderItem : this._renderItem
        let onSnapToItem = this.props.onSnapToItem ? this.props.onSnapToItem : (slideIndex) => { console.log("onSnapToItem to " + slideIndex) }

        let sliderWidth = DEVICE_WIDTH
        let itemWidth = DEVICE_WIDTH - 80
        return (
            <Carousel
                ref={(c) => { this._carousel = c; }}
                data={data}
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


export default translate("translations")(UFOSliderBar);