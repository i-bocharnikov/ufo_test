import React, { Component } from "react";
import usersStore from '../../stores/usersStore';
import { observer } from 'mobx-react';
import { translate } from "react-i18next";
import { Image, StyleSheet, View, Dimensions, ImageEditor, ImageStore } from 'react-native';
import { Container, Content, Form, Text, Row, Grid, Card, CardItem, Body, List, ListItem, Thumbnail } from 'native-base';
import { RNCamera } from 'react-native-camera';
import _ from 'lodash'

import HeaderComponent from "../../components/header";
import ActionSupportComponent from '../../components/actionSupport'
import ActionBarComponent from '../../components/actionBar'
import { screens, styles, icons, colors } from '../../utils/global'
import { observable } from "mobx";

const CARD_WIDTH = 300
const CARD_RATIO = 1.586
const CARD_HEIGHT = CARD_WIDTH / CARD_RATIO
//TODO Move this in constructor, what if lanscape?
let deviceWidth = Dimensions.get("window").width
let deviceHeight = Dimensions.get("window").height
let paddingV = (deviceHeight - CARD_HEIGHT) / 2
let paddingH = (deviceWidth - CARD_WIDTH) / 2

@observer
class IdentificationScreen extends Component {

  @observable identificationFrontImageUrl = null

  render() {

    const { t } = this.props;

    let user = usersStore.user
    let isUserConnected = !usersStore.isUserRegistrationMissing

    let actions = []

    if (!this.identificationFrontImageUrl) {
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
            if (this.camera) {
              const options = { quality: 1, base64: true };
              //Take photo
              let fullImage = await this.camera.takePictureAsync(options)
              //Crop Image
              const { uri, width, height } = fullImage;
              const ratioX = width / deviceWidth
              const ratioy = height / deviceHeight
              const cropData = {
                offset: { x: paddingH * ratioX, y: paddingV * ratioy },
                size: { width: CARD_WIDTH * ratioX, height: CARD_HEIGHT * ratioy },
              };
              ImageEditor.cropImage(uri, cropData, url => {
                this.identificationFrontImageUrl = url
              }, error => console.log(error.message))
            }
          }
        },
      ]
    } else {
      actions = [
        {
          style: styles.ACTIVE,
          icon: icons.REDO,
          onPress: () => { this.identificationFrontImageUrl = null }
        },
        {
          style: isUserConnected && this.identificationFrontImageUrl ? styles.TODO : styles.DISABLE,
          icon: icons.VALIDATE,
          onPress: async () => {
            if (this.identificationFrontImageUrl) {
              let document = await usersStore.uploadDocument("identification", "one_side", "id", "front_side", this.identificationFrontImageUrl)
              user.identification_front_side_reference = document.reference
              if (await usersStore.save()) {
                this.props.navigation.pop()
              }

            }
          }
        },
      ]
    }




    return (
      <Container>
        {!this.identificationFrontImageUrl && (
          <View style={_styles.container}>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={_styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'We need your permission to use your camera phone'}
            />
            <View style={{
              position: 'absolute',
              top: paddingV,
              left: paddingH,
              bottom: paddingV,
              right: paddingH,
              backgroundColor: colors.BACKGROUND.alpha(0.7).string(),
              justifyContent: 'center',
              alignContent: 'center'
            }}>
              <Text style={{ color: colors.TEXT.string(), textAlign: 'center' }}>{t('register:identificationFrontInputLabel')}</Text>
            </View>
          </View>
        )}
        {this.identificationFrontImageUrl && (
          <View style={{
            position: 'absolute',
            top: paddingV,
            left: paddingH,
            bottom: paddingV,
            right: paddingH,
          }}>
            <Image source={{ uri: this.identificationFrontImageUrl }} style={{ width: CARD_WIDTH, height: CARD_HEIGHT }} />
          </View>
        )}
        <HeaderComponent />
        {this.identificationFrontImageUrl && (
          <View>
            <Text style={{ color: colors.TEXT.string(), padding: 20 }}>{t('register:identificationCheckLabel')}</Text>
          </View>
        )
        }

        <ActionSupportComponent onPress={() => this.props.navigation.navigate(screens.SUPPORT, { context: screens.REGISTER_ADDRESS })} />
        <ActionBarComponent actions={actions} />
      </Container >
    );
  }
}

const _styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  preview: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default translate("translations")(IdentificationScreen);
