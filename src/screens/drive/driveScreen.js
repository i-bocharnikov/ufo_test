import React, { Component } from "react";
import { translate } from "react-i18next";
import { Container, Text } from 'native-base';
import { Dimensions, View, ScrollView, RefreshControl } from 'react-native'
import { observer } from "mobx-react";
import { observable } from "mobx";

import HeaderComponent from "../../components/header";
import Image from "../../components/Image";
import Icon from "../../components/Icon";
import ActionBarComponent from '../../components/actionBar'
import { screens, actionStyles, icons, colors, dateFormats, sizes } from '../../utils/global'
import driveStore from '../../stores/driveStore'
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


    let actionKeys = []


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

      if (driveStore.rental.contract_signed) {
        actionKeys = [
          {
            style: actionStyles.ACTIVE,
            icon: icons.KEY,
            onPress: () => otaKeyStore.enableKey(driveStore.rental.key_id)
          },
          {
            style: actionStyles.ACTIVE,
            icon: icons.CONNECT,
            onPress: () => otaKeyStore.connect(true)
          },
          {
            style: actionStyles.ACTIVE,
            icon: icons.UNLOCK,
            onPress: () => otaKeyStore.unlockDoors(true)
          },
          {
            style: actionStyles.ACTIVE,
            icon: icons.LOCK,
            onPress: () => otaKeyStore.lockDoors(true)
          },
          {
            style: actionStyles.ACTIVE,
            icon: icons.START,
            onPress: () => otaKeyStore.enableEngine(true)
          },
          {
            style: actionStyles.ACTIVE,
            icon: icons.STOP,
            onPress: () => otaKeyStore.disableEngine(true)
          }
        ]
      }

      if (driveStore.rental.ready_for_return) {
        actions.push(
          {
            style: actionStyles.TODO,
            icon: icons.RETURN,
            onPress: () => this.props.navigation.navigate(screens.RETURN.name)
          }
        )
      }
    }
    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={async () => await driveStore.listRentals()} />)

    let location = driveStore.rental ? driveStore.rental.location : null
    let carModel = driveStore.rental ? driveStore.rental.car ? driveStore.rental.car.car_model : null : null

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

          {driveStore.rental && (
            <View style={{
              flex: 1, flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center', backgroundColor: colors.BACKGROUND.alpha(0.8).string()
            }}>
              <Text style={{ paddingTop: 50, paddingBottom: 20 }}>{driveStore.rental.reference}</Text>
              <Text style={{ paddingBottom: 20 }}>{driveStore.format(driveStore.rental.start_at, dateFormats.FULL)}</Text>
              <Text style={{ paddingBottom: 30 }}>{driveStore.format(driveStore.rental.end_at, dateFormats.FULL)}</Text>
              <Text style={{ paddingBottom: 30 }}>{driveStore.rental.location.name}</Text>

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ width: CAR_WIDTH, height: CAR_HEIGHT }} source={{ uri: carModel.image_front_url }} />
                {driveStore.rental && driveStore.rental.key_id && (
                  <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingLeft: 20 }}>
                    <Icon icon={icons.KEY} color={colors.DISABLE} size={sizes.SMALL} />
                    <Icon icon={icons.BLUETOOTH} color={colors.DISABLE} size={sizes.SMALL} />
                  </View>
                )}
              </View>
              <Text style={{ paddingTop: 10 }}>{driveStore.rental.car.car_model.manufacturer + " " + driveStore.rental.car.car_model.name + " - " + driveStore.rental.car.reference}</Text>
            </View>
          )}


        </ScrollView >
        <ActionBarComponent actions={actionKeys} bottom={100} />
        <ActionBarComponent actions={actions} />
      </Container >
    );
  }
}


export default translate("translations")(DriveScreen);

