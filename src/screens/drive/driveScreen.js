import React, { Component } from 'react';
import { View, RefreshControl, ScrollView } from 'react-native';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { translate } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';
import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, UFOText } from './../../components/common';
import {
  screens,
  actionStyles,
  icons,
  backgrounds
} from './../../utils/global';
import appStore from './../../stores/appStore';
import { driveStore } from './../../stores';
import otaKeyStore from './../../stores/otaKeyStore';
import registerStore from './../../stores/registerStore';
import UFOCard from './../../components/UFOCard';
import UFOSlider from './../../components/UFOSlider';
import UFOPopover from './../../components/UFOPopover';
import DriveCard from './driveCard';
import { confirm, showToastError } from './../../utils/interaction';
import { checkAndRequestLocationPermission } from './../../utils/permissions';
import { keys as screenKeys } from './../../navigators/helpers';
import { checkServerAvailability } from './../../utils/api';
import styles from './styles';
import { checkConnectivity } from '../../utils/api_deprecated';
import DriverCardEditor from '../SignUp/DriverCardEditor';

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
      <UFOContainer image={background}>
        <UFOHeader
          transparent={true}
          logo={true}
          t={t}
          navigation={navigation}
          currentScreen={screens.DRIVE}
        />
        <ScrollView refreshControl={this.refreshControl()}>
          {!this.driveSelected && !driveStore.hasRentals && (
            <View style={styles.content}>
              <View style={styles.instructionContainer}>
                <UFOText h1 bold center style={styles.instructionRow}>
                  {t('home:reserve', { user: registerStore.user })}
                </UFOText>
                <UFOText h1 bold center style={styles.instructionRow}>
                  {t('home:register', { user: registerStore.user })}
                </UFOText>
                <UFOText h1 bold center style={styles.instructionRow}>
                  {t('home:drive', { user: registerStore.user })}
                </UFOText>
              </View>
            </View>
          )}
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

  refreshControl = () => (
    <RefreshControl
      refreshing={this.refreshing}
      onRefresh={this.refreshRental}
    />
  );

  renderRental({ item }) {
    if (item) {
      return <DriveCard rental={item} />;
    } else {
      return null;
    }
  }

  compileActions = () => {
    const { t, navigation } = this.props;
    const actions = [];

    if (!this.driveSelected) {
      /* initial home screen */
      actions.push({
        style: driveStore.hasRentalConfirmedOrOngoing
          ? actionStyles.DONE
          : actionStyles.TODO,
        icon: icons.RESERVE,
        //onPress: () => navigation.navigate(screenKeys.Booking)
        onPress: () => navigation.navigate(screenKeys.FaceRecognizer)
      });
      actions.push({
        style: registerStore.isUserRegistered
          ? actionStyles.DONE
          : actionStyles.TODO,
        icon: registerStore.isUserRegistered
          ? icons.MY_DETAILS
          : icons.REGISTER,
        onPress: () => navigation.navigate(screens.REGISTER.name)
      });
      actions.push({
        style: driveStore.hasRentalOngoing
          ? actionStyles.TODO
          : actionStyles.ACTIVE,
        icon: icons.DRIVE,
        onPress: () => (this.driveSelected = true)
      });
    } else if (this.driveSelected && !this.returnSelected) {
      /* back btn on drive screen */
      actions.push({
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => (this.driveSelected = false)
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
        driveStore.computeActionStartContract(actions, () =>
          this.props.navigation.navigate(screens.RENTAL_AGREEMENT.name)
        );

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
            onPress: () => (this.returnSelected = true)
          });
        }
      }
    } else {
      /* we see this after press "return" btn */
      actions.push({
        style: actionStyles.ACTIVE,
        icon: icons.BACK,
        onPress: () => (this.returnSelected = false)
      });
      driveStore.computeActionReturn(actions, () =>
        this.props.navigation.navigate(screens.RETURN.name)
      );
      driveStore.computeActionFinalInspect(actions, () =>
        this.props.navigation.navigate(screens.INSPECT.name)
      );
      driveStore.computeActionCloseRental(actions, () =>
        this.confirmCloseRental(t)
      );
    }

    return actions;
  };

  selectRental = async index => {
    this.activityPending = true;
    await driveStore.selectRental(index);
    await this.doEnableAndSwitch();
    this.activityPending = false;
  };

  doEnableAndSwitch = async () => {
    if (driveStore.inUse && driveStore.rental.key_id) {
      let keyId = driveStore.rental.key_id;
      if (keyId !== otaKeyStore.key.keyId || !otaKeyStore.isKeyEnabled) {
        await otaKeyStore.enableKey(keyId, false);
        await otaKeyStore.switchToKey(keyId, false);
      }
    }
  };

  refreshRental = async () => {
    this.activityPending = true;
    await appStore.register();
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
      this.activityPending = false;
      return;
    }
    if (!driveStore.rental.key_id) {
      showToastError(this.props.t('error:rentalKeyMissing'));
      this.activityPending = false;
      return;
    }

    await this.doEnableAndSwitch();

    await otaKeyStore.syncVehicleData(false);
    await otaKeyStore.isConnectedToVehicle(false);

    if (!DeviceInfo.isEmulator() && !otaKeyStore.isConnected) {
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
      this.activityPending = false;
      return;
    }

    if (!driveStore.inUse) {
      showToastError(this.props.t('error:rentalNotOpen'));
      this.activityPending = false;
      return;
    }
    if (!driveStore.rental.key_id) {
      showToastError(this.props.t('error:rentalKeyMissing'));
      this.activityPending = false;
      return;
    }

    if (await checkConnectivity()) await this.doEnableAndSwitch();

    if (!DeviceInfo.isEmulator() && !otaKeyStore.isConnected) {
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
      this.activityPending = false;
      return;
    }

    if (!driveStore.inUse) {
      showToastError(this.props.t('error:rentalNotOpen'));
      this.activityPending = false;
      return;
    }
    if (!driveStore.rental.key_id) {
      showToastError(this.props.t('error:rentalKeyMissing'));
      this.activityPending = false;
      return;
    }

    if (await checkConnectivity()) await this.doEnableAndSwitch();

    if (!DeviceInfo.isEmulator() && !otaKeyStore.isConnected) {
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
}

export default translate()(DriveScreen);
