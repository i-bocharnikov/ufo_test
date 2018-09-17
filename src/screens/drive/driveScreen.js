import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Text } from 'native-base';
import { Dimensions, View, ScrollView, RefreshControl } from 'react-native'
import { observer } from "mobx-react";
import { observable } from "mobx";

import HeaderComponent from "../../components/header";
import Image from "../../components/Image";
import ActionBarComponent from '../../components/actionBar'
import { screens, actionStyles, icons, colors, dateFormats } from '../../utils/global'
import rentalStore from '../../stores/rentalStore'
import otaKeyStore from '../../stores/otaKeyStore'


const BACKGROUND_WIDTH = Dimensions.get('window').width * 1.5
const BACKGROUND_HEIGHT = BACKGROUND_WIDTH / 2
const CAR_WIDTH = Dimensions.get('window').width / 2
const CAR_HEIGHT = CAR_WIDTH / 2

@observer
class DriveScreen extends Component {

  componentDidMount() {
  }

  @observable refreshing = false

  render() {
    const { t, navigation } = this.props;
    let actions = []

    if (rentalStore.rental) {
      if ((!rentalStore.rental.car_found && !rentalStore.rental.initial_inspection_done)) {
        actions.push(
          {
            style: actionStyles.TODO,
            icon: icons.FIND,
            onPress: () => this.props.navigation.navigate(screens.FIND.name)
          }
        )
      }
      if (!rentalStore.rental.initial_inspection_done) {
        actions.push(
          {
            style: actionStyles.TODO,
            icon: icons.INSPECT,
            onPress: () => this.props.navigation.navigate(screens.INSPECT.name)
          }
        )
      }
      if (!rentalStore.rental.contract_signed) {
        actions.push(
          {
            style: actionStyles.TODO,
            icon: icons.RENTAL_AGREEMENT,
            onPress: () => this.props.navigation.navigate(screens.RENTAL_AGREEMENT.name)
          }
        )
      }
      if (rentalStore.rental.ready_for_return) {
        actions.push(
          {
            style: actionStyles.TODO,
            icon: icons.RETURN,
            onPress: () => this.props.navigation.navigate(screens.RETURN.name)
          }
        )
      }
    }
    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={async () => await rentalStore.listRentals()} />)

    let location = rentalStore.rental ? rentalStore.rental.location : null
    let carModel = rentalStore.rental ? rentalStore.rental.car ? rentalStore.rental.car.car_model : null : null

    return (
      <Container>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={_RefreshControl}
        >
          {location && (
            <Image source={{ uri: location.image_url }} style={{ position: 'absolute', top: 0, width: BACKGROUND_WIDTH, height: BACKGROUND_HEIGHT }} />
          )}
          <HeaderComponent transparent t={t} navigation={navigation} currentScreen={screens.DRIVE} />

          {rentalStore.rental && (
            <View style={{
              flex: 1, flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center', backgroundColor: colors.BACKGROUND.alpha(0.8).string()
            }}>
              <Text style={{ paddingTop: 50, paddingBottom: 20 }}>{rentalStore.rental.reference}</Text>
              <Text style={{ paddingBottom: 20 }}>{rentalStore.format(rentalStore.rental.start_at, dateFormats.FULL)}</Text>
              <Text style={{ paddingBottom: 30 }}>{rentalStore.format(rentalStore.rental.end_at, dateFormats.FULL)}</Text>
              <Text style={{ paddingBottom: 30 }}>{rentalStore.rental.location.name}</Text>
              <Image style={{ width: CAR_WIDTH, height: CAR_HEIGHT }} source={{ uri: carModel.image_front_url }} />
              <Text style={{ paddingTop: 10 }}>{rentalStore.rental.car.car_model.manufacturer + " " + rentalStore.rental.car.car_model.name + " - " + rentalStore.rental.car.reference}</Text>
            </View>
          )}


        </ScrollView >
        <ActionBarComponent actions={actions} />
      </Container >
    );
  }
}


export default translate("translations")(DriveScreen);

