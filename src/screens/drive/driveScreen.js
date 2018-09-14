import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Text } from 'native-base';
import { Dimensions, View, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { observer } from "mobx-react";
import { observable } from "mobx";

import HeaderComponent from "../../components/header";
import ActionBarComponent from '../../components/actionBar'
import { screens, actionStyles, icons, colors, dateFormats } from '../../utils/global'
import configurations from "../../utils/configurations"
import driveStore from '../../stores/driveStore'

const window = Dimensions.get('window');
const BACKGROUND_WIDTH = Dimensions.get('window').width * 1.5
const BACKGROUND_HEIGHT = BACKGROUND_WIDTH / 2
const CAR_WIDTH = Dimensions.get('window').width / 2
const CAR_HEIGHT = CAR_WIDTH / 2

@observer
class DriveScreen extends Component {

  @observable refreshing = false

  render() {
    const { t, navigation } = this.props;
    let actions = []

    if (driveStore.rental) {

      if ((!driveStore.rental.car_found && !driveStore.rental.initial_inspection_done)) {
        actions.push(
          {
            style: actionStyles.TODO,
            icon: icons.FIND,
            onPress: () => this.props.navigation.navigate(screens.FIND.name)
          }
        )
      }
      if (!driveStore.rental.initial_inspection_done) {
        actions.push(
          {
            style: actionStyles.TODO,
            icon: icons.INSPECT,
            onPress: () => this.props.navigation.navigate(screens.INSPECT.name)
          }
        )
      }
      if (!driveStore.rental.contract_signed) {
        actions.push(
          {
            style: actionStyles.TODO,
            icon: icons.RENTAL_AGREEMENT,
            onPress: () => this.props.navigation.navigate(screens.RENTAL_AGREEMENT.name)
          }
        )
      }
    }

    let backgroundImageUrl = configurations.UFO_SERVER_API_URL + driveStore.rental.location.image_urn
    let carImageUrl = configurations.UFO_SERVER_API_URL + driveStore.rental.car.car_model.image_front_urn

    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={async () => await driveStore.refresh()} />)

    return (
      <Container>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={_RefreshControl}
        >
          <Image source={{ uri: backgroundImageUrl, width: BACKGROUND_WIDTH, height: BACKGROUND_HEIGHT }} style={{ position: 'absolute', top: 0, }} resizeMode={Image.resizeMode.cover} />
          <HeaderComponent transparent t={t} navigation={navigation} currentScreen={screens.DRIVE} />
          <View style={{
            flex: 1, flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center', backgroundColor: colors.BACKGROUND.alpha(0.8).string()
          }}>
            <Text style={{ paddingTop: 50, paddingBottom: 20 }}>{driveStore.rental.reference}</Text>
            <Text style={{ paddingBottom: 20 }}>{driveStore.format(driveStore.rental.start_at, dateFormats.FULL)}</Text>
            <Text style={{ paddingBottom: 30 }}>{driveStore.format(driveStore.rental.end_at, dateFormats.FULL)}</Text>
            <Text style={{ paddingBottom: 30 }}>{driveStore.rental.location.name}</Text>
            <Image style={{}} source={{ uri: carImageUrl, width: CAR_WIDTH, height: CAR_HEIGHT }} resizeMode={Image.resizeMode.cover} />
            <Text style={{ paddingTop: 10 }}>{driveStore.rental.car.car_model.manufacturer + " " + driveStore.rental.car.car_model.name + " - " + driveStore.rental.car.reference}</Text>
          </View>



        </ScrollView >
        <ActionBarComponent actions={actions} />
      </Container >
    );
  }
}


export default translate("translations")(DriveScreen);

