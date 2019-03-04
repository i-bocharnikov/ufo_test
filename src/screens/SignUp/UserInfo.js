import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { observer } from 'mobx-react';
import { observable, reaction } from 'mobx';
import { translate } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';

import { registerStore } from './../../stores';
import screenKeys from './../../navigators/helpers/screenKeys';
import { UFOContainer, UFOIcon, UFOImage } from './../../components/common';
import styles from './styles';
import { values, images } from './../../utils/theme';

const IS_EMULATOR = DeviceInfo.isEmulator();

@observer
class UserInfo extends Component {
  @observable refreshing = false;

  async componentDidMount() {
    await registerStore.fetchScanDocumentThumbs();

    reaction(
      () => registerStore.isConnected,
      () => registerStore.isConnected && this.refreshSignUpData()
    );
  }

  render() {
    return (
      <UFOContainer style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              onRefresh={this.refreshData}
              refreshing={this.refreshing}
            />
          }
        >
          {this.renderContactsBlock()}
          {this.renderAddressBlock()}
          {this.renderScanThumbBlock()}
        </ScrollView>
      </UFOContainer>
    );
  }

  renderContactsBlock = () => {
    const { t } = this.props;

    return (
      <TouchableOpacity
        onPress={this.navToUserContactsScreen}
        style={[ styles.infoPreviewBlock, styles.blockShadow ]}
        activeOpacity={values.BTN_OPACITY_DEFAULT}
      >
        <Text style={styles.infoPreviewTitle}>
          {t('userInfoPersonalTitle')}
        </Text>
        <Text style={styles.infoPreviewItem} numberOfLines={1}>
          {registerStore.user.phone_number || t('phoneLabel')}
        </Text>
        <Text style={styles.infoPreviewItem} numberOfLines={1}>
          {registerStore.user.email || t('emailInputLabel')}
        </Text>
        <UFOIcon
          name="md-checkmark"
          style={styles.infoPreviewIcon}
        />
        <Text style={styles.previewEditLabel}>
          {t('editBtn')}
        </Text>
      </TouchableOpacity>
    );
  };

  renderAddressBlock = () => {
    const { t } = this.props;

    return (
      <TouchableOpacity
        onPress={this.navToUserAddressScreen}
        style={[ styles.infoPreviewBlock, styles.blockShadow ]}
        activeOpacity={values.BTN_OPACITY_DEFAULT}
      >
        <Text style={styles.infoPreviewTitle}>
          {t('userInfoAddresslTitle')}
        </Text>
        <Text style={styles.infoPreviewItem} numberOfLines={1}>
          {registerStore.user.company_name || t('companyNameLabel')}
        </Text>
        <Text style={styles.infoPreviewItem} numberOfLines={1}>
          {registerStore.user.vat_number || t('vatNumberLabel')}
        </Text>
        <Text style={styles.infoPreviewItem} numberOfLines={2}>
          {registerStore.user.address || t('addressLabel')}
        </Text>
        <UFOIcon
          name="md-checkmark"
          style={styles.infoPreviewIcon}
        />
        <Text style={styles.previewEditLabel}>
          {t('editBtn')}
        </Text>
      </TouchableOpacity>
    );
  };

  renderScanThumbBlock = () => {
    const { t } = this.props;
    const idCardFilled = registerStore.idCardFrontScan && registerStore.idCardBackScan;
    const dlCardFilled = registerStore.dlCardFrontScan && registerStore.dlCardBackScan;

    return (
      <View style={styles.row}>
        <TouchableOpacity
          onPress={this.navToIdCardScreen}
          style={[ styles.cardPickerBlock, styles.cardPickerBlockIndent, styles.blockShadow ]}
          activeOpacity={values.BTN_OPACITY_DEFAULT}
        >
          {idCardFilled ? (
            <View>
              <UFOImage
                source={{ uri: registerStore.idCardFrontScan }}
                style={styles.cardThumb}
              />
              <UFOImage
                source={{ uri: registerStore.idCardBackScan }}
                style={styles.cardThumb}
              />
            </View>
          ) : (
            <UFOImage
              source={images.photoPicker}
              style={styles.cardPickerImg}
            />
          )}
          {idCardFilled && (
            <UFOIcon
              name="md-checkmark"
              style={styles.infoPreviewIcon}
            />
          )}
          <Text style={styles.cardPickerLabel}>
            {t('idCardThumbLabel')}
          </Text>
          <Text style={[ styles.previewEditLabel, styles.cardPickerEditPosition ]}>
            {t('editBtn')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.navToDriverCardScreen}
          style={[ styles.cardPickerBlock, styles.blockShadow ]}
          activeOpacity={values.BTN_OPACITY_DEFAULT}
        >
          {dlCardFilled ? (
            <View>
              <UFOImage
                source={{ uri: registerStore.dlCardFrontScan }}
                style={styles.cardThumb}
              />
              <UFOImage
                source={{ uri: registerStore.dlCardBackScan }}
                style={styles.cardThumb}
              />
            </View>
          ) : (
            <UFOImage
              source={images.photoPicker}
              style={styles.cardPickerImg}
            />
          )}
          {idCardFilled && (
            <UFOIcon
              name="md-checkmark"
              style={styles.infoPreviewIcon}
            />
          )}
          <Text style={styles.cardPickerLabel}>
            {t('dlThumbLabel')}
          </Text>
          <Text style={[ styles.previewEditLabel, styles.cardPickerEditPosition ]}>
            {t('editBtn')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  refreshData = async () => {
    this.refreshing = true;
    await registerStore.getUserData();
    await registerStore.fetchScanDocumentThumbs();
    this.refreshing = false;
  };

  navToUserContactsScreen = () => {
    this.props.navigation.navigate(screenKeys.Contacts);
  };

  navToUserAddressScreen = () => {
    this.props.navigation.navigate(screenKeys.Address);
  };

  navToIdCardScreen = () => {
    const { navigation, t } = this.props;
    const params = {
      actionNavNext: () => navigation.navigate(screenKeys.Identification),
      actionNavBack: () => navigation.navigate(screenKeys.SignUp),
      actionHandleFileAsync: registerStore.uploadFaceCapture,
      description: t('faceRecognizing:registerCaptureDescription'),
      autohandling: true
    };

    if (registerStore.user.face_capture_required && !IS_EMULATOR) {
      navigation.navigate(screenKeys.FaceRecognizer, params);
    } else {
      this.props.navigation.navigate(screenKeys.Identification);
    }
  };

  navToDriverCardScreen = () => {
    this.props.navigation.navigate(screenKeys.DriverLicence);
  };
}

export default translate('register')(UserInfo);
