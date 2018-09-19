import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Text, Title, Left, Body, Right, Card, CardItem } from 'native-base';
import { Dimensions, View, Image, ImageBackground, ScrollView, RefreshControl } from 'react-native'
import { observer } from "mobx-react";
import { observable } from "mobx";
import Carousel from 'react-native-snap-carousel';


import HeaderComponent from "../../components/header";
import ActionBarComponent from '../../components/actionBar'
import { screens, actionStyles, icons, colors, dateFormats } from '../../utils/global'
import configurations from "../../utils/configurations"
import driveStore from '../../stores/driveStore'
import SliderComponent from './slide/slide'
const markerImage = require('../../assets/images/marker.png')

const window = Dimensions.get('window');
const DEVICE_WIDTH = Dimensions.get('window').width
const DEVICE_HEIGHT = DEVICE_WIDTH / 2
const CAR_WIDTH = Dimensions.get('window').width - 40
const CAR_HEIGHT = CAR_WIDTH / 2

@observer
class TermScreen extends Component {

  componentDidMount() {
    this.refresh()
  }


  @observable refreshing = false

  refresh = async () => {
    await driveStore.listCarDamages()
  }

  _renderItem({ item, index }) {
    let damage = item

    let slideItem = {
      title: 'Damage ' + index,
      subtitle: damage.comment,
      illustration: "LOADING"//+damage.document
    }

    return (
      <SliderComponent data={slideItem} even={false} />
    );
  }

  render() {
    const { t, navigation } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.navigate(screens.DRIVE.name)
      },
    ]


    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={this.refresh} />)
    let carModel = driveStore.rental ? driveStore.rental.car ? driveStore.rental.car.car_model : null : null



    return (
      <Container>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={_RefreshControl}
        >
          <HeaderComponent transparent t={t} navigation={navigation} currentScreen={screens.DRIVE} title={t('inspect:inspectTitle', { rental: driveStore.rental })} />
          <View style={{
            flex: 1, flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center', backgroundColor: colors.BACKGROUND.alpha(0.8).string()
          }}>
            <Text style={{ paddingTop: 50, paddingBottom: 20 }}>{t('inspect:confirmTitle')}</Text>
            <Text style={{ paddingBottom: 20 }}>{driveStore.rental ? driveStore.rental.car.damage_state : ""}</Text>
            <ImageBackground style={{ width: CAR_WIDTH, height: CAR_HEIGHT }} source={{ uri: carModel.image_top_h_url }} >
              <Image style={{
                position: 'relative',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                width: 15,
                height: 15
              }} source={markerImage} />
            </ImageBackground>
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={driveStore.carDamages}
              renderItem={this._renderItem}
              sliderWidth={DEVICE_WIDTH}
              itemWidth={CAR_WIDTH - 40}
              inactiveSlideScale={0.94}
              inactiveSlideOpacity={0.7}
            />
          </View>



        </ScrollView >
        <ActionBarComponent actions={actions} />
      </Container >
    );
  }
}


export default translate("translations")(TermScreen);

