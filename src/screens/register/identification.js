import React, { Component } from "react";
import usersStore from '../../stores/usersStore';
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import { Dimensions, Keyboard, Image } from 'react-native';
import { Container, Content, Form, Text, Row, Grid, Card, CardItem, Body, List, ListItem, Thumbnail } from 'native-base';
import { CameraKitCamera } from 'react-native-camera-kit'
import _ from 'lodash'

import HeaderComponent from "../../components/header";
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import { screens, styles, icons, colors } from '../../utils/global'
import { observable } from "mobx";




@observer
class IdentificationScreen extends Component {

  @observable identificationFrontImage = null
  @observable identificationFrontDocument = null

  onChangeIdentificationFront = (document) => {
    if (document) {
      this.identificationFrontDocument = document
      usersStore.user.identification_front_side_reference = document.reference
    }
  }
  onChangeIdentificationBack = (document) => {
    if (document) {
      usersStore.user.identification_back_side_reference = document.reference
    }
  }

  render() {

    const { t } = this.props;

    let user = usersStore.user
    let isUserConnected = !usersStore.isUserRegistrationMissing

    let actions = []

    if (!this.identificationFrontImage) {
      actions = [
        {
          style: styles.ACTIVE,
          icon: icons.BACK,
          onPress: () => this.props.navigation.pop()
        },
        {
          style: isUserConnected && usersStore.user && !_.isEmpty(usersStore.user.address) ? styles.TODO : styles.DISABLE,
          icon: icons.CAPTURE,
          onPress: async () => {
            this.identificationFrontImage = await this.camera.capture(true);
            this.identificationFrontDocument = null
          }
        },
      ]
    } else {
      actions = [
        {
          style: styles.ACTIVE,
          icon: icons.REDO,
          onPress: () => { this.identificationFrontImage = null }
        },
        {
          style: isUserConnected && this.identificationFrontDocument ? styles.TODO : styles.DISABLE,
          icon: icons.VALIDATE,
          onPress: async () => {
            this.identificationFrontImage = await this.camera.capture(true);
            this.identificationFrontDocument = null
            let response = await usersStore.uploadDocument("identification", "one_side", "id", "front_side", this.identificationFrontImage)
            this.identificationFrontDocument = response.document
            this.props.navigation.pop()
          }
        },
      ]
    }

    return (
      <Container>
        <HeaderComponent title={t('register:identificationTitle', { user: usersStore.user })} />
        <Content padder>
          <List>
            {!this.identificationFrontImage && (
              <ListItem >
                <Body style={{ height: 300 }}>
                  <Text style={{ color: colors.TEXT.string(), paddingBottom: 25 }}>{t('register:identificationFrontInputLabel')}</Text>
                  <CameraKitCamera
                    ref={cam => this.camera = cam}
                    style={{
                      flex: 1,
                      backgroundColor: 'white',
                    }}
                    cameraOptions={{
                      flashMode: 'auto',             // on/off/auto(default)
                      focusMode: 'on',               // off/on(default)
                      zoomMode: 'on',                // off/on(default)
                    }}
                    onReadQRCode={(event) => console.log(event.nativeEvent.qrcodeStringValue)} // optional
                  />
                </Body>
              </ListItem>
            )}
            {this.identificationFrontImage && (
              <ListItem >
                <Body style={{ height: 300 }}>
                  <Text style={{ color: colors.TEXT.string(), paddingBottom: 25 }}>{t('register:identificationCheckLabel')}</Text>
                  <Image source={this.identificationFrontImage} />
                </Body>
              </ListItem>
            )}
          </List>
        </Content>

        <ActionSupportComponent onPress={() => this.props.navigation.navigate(screens.SUPPORT, { context: screens.REGISTER_ADDRESS })} />
        <ActionBarComponent actions={actions} />
      </Container>
    );
  }
}

export default translate("translations")(IdentificationScreen);
