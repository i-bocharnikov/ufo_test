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
class InspectScreen extends Component {

  @observable refreshing = false

  render() {
    const { t, navigation } = this.props;
    let actions = [
      {
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => this.props.navigation.navigate(screens.DRIVE.name)
      },
    ]


    let _RefreshControl = (<RefreshControl refreshing={this.refreshing} onRefresh={async () => await driveStore.refresh()} />)

    return (
      <Container>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={_RefreshControl}
        >
          <HeaderComponent transparent t={t} navigation={navigation} currentScreen={screens.DRIVE} title={t('drive:rentalAgreementTitle', { rental: driveStore.rental })} />
          <View style={{
            flex: 1, flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center', backgroundColor: colors.BACKGROUND.alpha(0.8).string()
          }}>
            <Text style={{ paddingTop: 50, paddingBottom: 20 }}>{driveStore.rental.reference}</Text>
          </View>



        </ScrollView >
        <ActionBarComponent actions={actions} />
      </Container >
    );
  }
}


export default translate("translations")(InspectScreen);

