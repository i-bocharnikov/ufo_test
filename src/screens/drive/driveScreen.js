import React, { Component } from 'react';
import { View, RefreshControl, ScrollView, Platform } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { BluetoothStatus } from 'react-native-bluetooth-status';
import _ from 'lodash';

import {
  appStore,
  driveStore,
  registerStore,
  otaKeyStore
} from './../../stores';
import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer } from './../../components/common';
import UFOCard from './../../components/UFOCard';
import UFOSlider from './../../components/UFOSlider';
import UFOPopover from './../../components/UFOPopover';
import DriveCard from './driveCard';
import {
  screens,
  actionStyles,
  icons,
  backgrounds
} from './../../utils/global';
import { confirm, showToastError } from './../../utils/interaction';
import { checkAndRequestLocationPermission } from './../../utils/permissions';
import { checkConnectivity, uploadToApi } from '../../utils/api_deprecated';
import pushNotificationService from './../../utils/pushNotificationService';
import remoteLoggerService from '../../utils/remoteLoggerService';
import screenKeys from './../../navigators/helpers/screenKeys';
import { checkServerAvailability } from './../../utils/api';
import styles from './styles';
import { videos } from './../../utils/theme';

@observer
class DriveScreen extends Component {
  @observable driveSelected = false;
  @observable returnSelected = false;
  @observable refreshing = false;
  @observable activityPending = false;

  async componentDidMount() {
    if (driveStore.hasRentalOngoing && registerStore.isUserRegistered) {
      await checkAndRequestLocationPermission();
      this.driveSelected = true;
    }

    const isRegister = await pushNotificationService.register();

    if (isRegister) {
      pushNotificationService.addListeners();
    }
  }

  componentWillUnmount() {
    pushNotificationService.removeListeners();
  }

  async componentDidUpdate() {
    await this.doEnableAndSwitch();
  }

  render() {
    const { t, navigation } = this.props;
    const background = this.driveSelected
      ? this.returnSelected
        ? backgrounds.RETURN001
        : backgrounds.DRIVE001
      : driveStore.hasRentals
      ? backgrounds.HOME001
      : backgrounds.HOME002;

    return (
      <UFOContainer
        video={driveStore.hasRentals ? null : videos.homeScreenBg}
        image={background}
      >
        <UFOHeader
          transparent={true}
          logo={true}
          t={t}
          navigation={navigation}
          currentScreen={screens.DRIVE}
        />
        <ScrollView refreshControl={this.refreshControl()}>
          {driveStore.hasRentals && driveStore.rental && (
            <View style={styles.rentalsWrapper}>
              <UFOSlider
                data={driveStore.rentals}
                renderItem={this.renderRental}
                onSnapToItem={this.selectRental}
                firstItem={driveStore.index}
              />
            </View>
          )}
          {this.driveSelected && !driveStore.rental && (
            <View style={styles.driveWrapper}>
              <UFOCard
                title={t('drive:noRentalsTitle')}
                text={t('drive:noRentalsDescription')}
              />
            </View>
          )}
        </ScrollView>
        <UFOActionBar
          actions={this.compileActions()}
          activityPending={this.activityPending}
        />
        <UFOPopover message={_.get(driveStore, 'rental.message_for_driver')} />
      </UFOContainer>
    );
  }

  renderRental = ({ item }) =>
    !item ? null : (
      <DriveCard rental={item} navigation={this.props.navigation} />
    );

  refreshControl = () => (
    <RefreshControl
      refreshing={this.refreshing}
      onRefresh={this.refreshRental}
    />
  );

  get actionsHomeScreen() {
    return [
      {
        style: driveStore.hasRentalConfirmedOrOngoing
          ? actionStyles.DONE
          : actionStyles.TODO,
        icon: icons.RESERVE,
        onPress: this.navToBooking
      },
      {
        style:
          registerStore.isUserRegistered ||
          !driveStore.hasRentalConfirmedOrOngoing
            ? actionStyles.DONE
            : actionStyles.TODO,
        icon: registerStore.isUserRegistered
          ? icons.MY_DETAILS
          : icons.REGISTER,
        onPress: this.navToRegister
      },
      {
        style: driveStore.hasRentalOngoing
          ? actionStyles.TODO
          : actionStyles.ACTIVE,
        icon: icons.DRIVE,
        onPress: () => {
          this.driveSelected = true;
        }
      }
    ];
  }

  get actionsDriveScreen() {
    const actions = [];

    actions.push({
      style: actionStyles.ACTIVE,
      icon: icons.BACK,
      onPress: () => {
        this.driveSelected = false;
      }
    });

    if (!driveStore.hasRentals) {
      /* we see this when rentals list is empty */
      actions.push({
        style: actionStyles.DISABLE,
        icon: icons.FIND,
        onPress: () => null
      });
      actions.push({
        style: actionStyles.DISABLE,
        icon: icons.INSPECT,
        onPress: () => null
      });
      actions.push({
        style: actionStyles.DISABLE,
        icon: icons.RENTAL_AGREEMENT,
        onPress: () => null
      });
    } else {
      /* we add mixins to actions into stores */
      /* it's really a bad approach and it block should be rewritten */
      driveStore.computeActionFind(actions, () =>
        this.props.navigation.navigate(screens.FIND.name)
      );
      driveStore.computeActionInitialInspect(actions, () =>
        this.props.navigation.navigate(screens.INSPECT.name)
      );
      driveStore.computeActionStartContract(actions, this.startContractSigning);

      if (driveStore.inUse) {
        otaKeyStore.computeActionEnableKey(
          driveStore.rental ? driveStore.rental.key_id : null,
          actions,
          this.doEnableKey
        );
        otaKeyStore.computeActionUnlock(actions, this.doUnlockCar);
        otaKeyStore.computeActionLock(actions, this.doLockCar);
        /* return btn */
        actions.push({
          style: actionStyles.ACTIVE,
          icon: icons.RETURN,
          onPress: () => {
            this.returnSelected = true;
          }
        });
      }
    }

    return actions;
  }

  get actionsReturnScreen() {
    const actions = [];

    actions.push({
      style: actionStyles.ACTIVE,
      icon: icons.BACK,
      onPress: () => {
        this.returnSelected = false;
      }
    });
    driveStore.computeActionReturn(actions, () =>
      this.props.navigation.navigate(screens.RETURN.name)
    );
    driveStore.computeActionFinalInspect(actions, () =>
      this.props.navigation.navigate(screens.INSPECT.name)
    );
    driveStore.computeActionCloseRental(actions, () =>
      this.confirmCloseRental(this.props.t)
    );

    return actions;
  }

  compileActions = () => {
    if (!this.driveSelected) {
      return this.actionsHomeScreen;
    } else if (this.driveSelected && !this.returnSelected) {
      return this.actionsDriveScreen;
    } else {
      return this.actionsReturnScreen;
    }
  };

  selectRental = async index => {
    this.activityPending = true;
    await driveStore.selectRental(index);
    await this.doEnableAndSwitch();
    this.activityPending = false;
  };

  doEnableAndSwitch = async () => {
    if (driveStore.inUse && driveStore.rental.key_id) {
      const keyId = driveStore.rental.key_id;
      if (keyId !== otaKeyStore.key.keyId || !otaKeyStore.isKeyEnabled) {
        await otaKeyStore.enableKey(keyId, false);
        await otaKeyStore.switchToKey(keyId, false);
      }
    }
  };

  refreshRental = async () => {
    this.activityPending = true;
    if (await checkConnectivity()) {
      await appStore.register();
      await remoteLoggerService.initialise();
    }
    await driveStore.reset();
    await this.doEnableAndSwitch();
    this.activityPending = false;
  };

  doCloseRental = async () => {
    this.activityPending = true;

    if (driveStore.rental && driveStore.rental.key_id) {
      await otaKeyStore.lockDoors(false, false);
      await otaKeyStore.endKey(driveStore.rental.key_id);
    }

    await driveStore.closeRental();
    this.returnSelected = false;
    this.driveSelected = false;
    this.activityPending = false;
  };

  doEnableKey = async () => {
    this.activityPending = true;
    await driveStore.refreshRental();

    if (!driveStore.inUse) {
      showToastError(this.props.t('error:rentalNotOpen'));
      await remoteLoggerService.error(
        'enableKey',
        this.props.t('error:localPermissionNeeded'),
        {},
        otaKeyStore.key
      );
      this.activityPending = false;
      return;
    }

    const isBleEnabled = await this.checkBluetoothState();
    if (!isBleEnabled) {
      showToastError(this.props.t('error:bluetoothNeeded'));
      await remoteLoggerService.error(
        'enableKey',
        this.props.t('error:bluetoothNeeded'),
        {},
        otaKeyStore.key
      );
      this.activityPending = false;
      return;
    }

    if (!driveStore.rental.key_id) {
      showToastError(this.props.t('error:rentalKeyMissing'));
      await remoteLoggerService.error(
        'enableKey',
        this.props.t('error:rentalKeyMissing'),
        {},
        otaKeyStore.key
      );
      this.activityPending = false;
      return;
    }

    await this.doEnableAndSwitch();

    await otaKeyStore.syncVehicleData(false);
    if (!DeviceInfo.isEmulator() && !otaKeyStore.isConnectedToVehicle(true)) {
      await otaKeyStore.connect(
        false,
        false
      );
      await otaKeyStore.getVehicleData(false);
    }

    this.activityPending = false;
  };

  doUnlockCar = async () => {
    this.activityPending = true;
    const permission = await checkAndRequestLocationPermission();
    if (!permission) {
      showToastError(this.props.t('error:localPermissionNeeded'));
      await remoteLoggerService.error(
        'unlockCar',
        this.props.t('error:localPermissionNeeded'),
        {},
        otaKeyStore.key
      );
      this.activityPending = false;
      return;
    }

    const isBleEnabled = await this.checkBluetoothState();
    if (!isBleEnabled) {
      showToastError(this.props.t('error:bluetoothNeeded'));
      await remoteLoggerService.error(
        'unlockCar',
        this.props.t('error:bluetoothNeeded'),
        {},
        otaKeyStore.key
      );
      this.activityPending = false;
      return;
    }

    if (!driveStore.inUse) {
      showToastError(this.props.t('error:rentalNotOpen'));
      await remoteLoggerService.error(
        'unlockCar',
        this.props.t('error:rentalNotOpen'),
        {},
        otaKeyStore.key
      );
      this.activityPending = false;
      return;
    }
    if (!driveStore.rental.key_id) {
      showToastError(this.props.t('error:rentalKeyMissing'));
      await remoteLoggerService.error(
        'unlockCar',
        this.props.t('error:rentalKeyMissing'),
        {},
        otaKeyStore.key
      );
      this.activityPending = false;
      return;
    }

    if (await checkConnectivity()) {
      await this.doEnableAndSwitch();
    }

    if (!DeviceInfo.isEmulator() && !otaKeyStore.isConnectedToVehicle(true)) {
      await otaKeyStore.connect(
        false,
        false
      );
    }

    await otaKeyStore.unlockDoors(false, true);
    await otaKeyStore.getVehicleData(false);

    this.activityPending = false;
  };

  doLockCar = async () => {
    this.activityPending = true;
    const permission = await checkAndRequestLocationPermission();
    if (!permission) {
      showToastError(this.props.t('error:localPermissionNeeded'));
      await remoteLoggerService.error(
        'lockCar',
        this.props.t('error:localPermissionNeeded'),
        {},
        otaKeyStore.key
      );
      this.activityPending = false;
      return;
    }

    const isBleEnabled = await this.checkBluetoothState();
    if (!isBleEnabled) {
      showToastError(this.props.t('error:bluetoothNeeded'));
      await remoteLoggerService.error(
        'lockCar',
        this.props.t('error:bluetoothNeeded'),
        {},
        otaKeyStore.key
      );
      this.activityPending = false;
      return;
    }

    if (!driveStore.inUse) {
      showToastError(this.props.t('error:rentalNotOpen'));
      await remoteLoggerService.error(
        'lockCar',
        this.props.t('error:rentalNotOpen'),
        {},
        otaKeyStore.key
      );
      this.activityPending = false;
      return;
    }
    if (!driveStore.rental.key_id) {
      showToastError(this.props.t('error:rentalKeyMissing'));
      await remoteLoggerService.error(
        'lockCar',
        this.props.t('error:rentalKeyMissing'),
        {},
        otaKeyStore.key
      );

      this.activityPending = false;
      return;
    }

    if (await checkConnectivity()) {
      await this.doEnableAndSwitch();
    }

    if (!DeviceInfo.isEmulator() && !otaKeyStore.isConnectedToVehicle(true)) {
      await otaKeyStore.connect(
        false,
        false
      );
    }

    await otaKeyStore.lockDoors(false, true);
    await otaKeyStore.getVehicleData(false);

    this.activityPending = false;
  };

  doConnectCar = async () => {
    this.activityPending = true;
    await otaKeyStore.connect();
    await otaKeyStore.getVehicleData();
    this.activityPending = false;
  };

  confirmCloseRental = async t => {
    const keyMessage =
      driveStore.rental &&
      driveStore.rental.car &&
      driveStore.rental.car.has_key === true
        ? t('drive:confirmCloseRentalKeyMessageConfirmationMessage')
        : '';

    await confirm(
      t('global:confirmationTitle'),
      t('drive:confirmCloseRentalConfirmationMessage', { keyMessage }),
      async () => {
        this.doCloseRental();
      }
    );
  };

  navToBooking = async () => {
    const serverAvailable = await checkServerAvailability();

    if (!serverAvailable) {
      showToastError(this.props.t('error:connectionIsRequired'));
      return;
    }

    this.props.navigation.navigate(screenKeys.Booking);
  };

  navToRegister = () => {
    if (registerStore.isConnected) {
      this.props.navigation.navigate(screenKeys.Register);
    } else {
      this.props.navigation.navigate(screenKeys.Phone);
    }
  };

  startContractSigning = () => {
    const { navigation, t } = this.props;
    const params = {
      actionNavNext: () => navigation.navigate(screenKeys.RentalAgreement),
      actionNavBack: () => navigation.navigate(screenKeys.Drive),
      actionHandleFileAsync: this.validateCapturedFace,
      description: t('faceRecognizing:rentalCaptureDescription'),
      nextBtnLabel: t('faceRecognizing:validateBtnLabel'),
      handlingErrorMessage: t('faceRecognizing:handlingRentalError')
    };
    if (driveStore.rental.face_capture_required && !DeviceInfo.isEmulator()) {
      navigation.navigate(screenKeys.FaceRecognizer, params);
    } else {
      navigation.navigate(screenKeys.RentalAgreement);
    }
  };

  validateCapturedFace = async fileUri => {
    try {
      const uploadedFace = await uploadToApi(
        'identification',
        'one_side',
        'face_capture',
        'front_side',
        fileUri
      );

      if (_.has(uploadedFace, 'data.document.reference')) {
        return await driveStore.rentalFaceValidation(
          uploadedFace.data.document.reference
        );
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  checkBluetoothState = async () => {
    try {
      let isEnabled = await BluetoothStatus.state();

      if (Platform.OS === 'android') {
        /* available android only, ios should be enabled manually */
        isEnabled = await BluetoothStatus.enable();
      }

      return isEnabled;
    } catch (error) {
      return false;
    }
  };
}

export default translate()(DriveScreen);
