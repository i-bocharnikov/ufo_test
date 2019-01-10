import React, { Component } from 'react';
import { View, RefreshControl } from 'react-native';
import { observer } from 'mobx-react';
import { observable, action, when } from 'mobx';
import { translate } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import UFOHeader from './../../components/header/UFOHeader';
import UFOActionBar from './../../components/UFOActionBar';
import { UFOContainer, UFOText } from './../../components/common';
import {
    screens,
    actionStyles,
    icons,
    colors,
    dims,
    backgrounds,
} from './../../utils/global';
import appStore from './../../stores/appStore';
import { driveStore } from './../../stores';
import otaKeyStore from './../../stores/otaKeyStore';
import registerStore from './../../stores/registerStore';
import UFOCard from './../../components/UFOCard';
import UFOSlider from './../../components/UFOSlider';
import DriveCard from './driveCard';
import { confirm, showToastError } from './../../utils/interaction';
import { checkAndRequestLocationPermission } from './../../utils/permissions';
import { keys as screenKeys } from './../../navigators/helpers';
import { checkConnectivity } from '../../utils/api_deprecated';

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
            this.doEnableAndSwitch();
        }
    }

    renderRental({ item }) {
        if (item) {
            return <DriveCard rental={item} />;
        } else {
            return null;
        }
    }

    render() {
        const { t, navigation } = this.props;

        const _RefreshControl = (
            <RefreshControl
                refreshing={this.refreshing}
                onRefresh={this.refreshRental}
            />
        );

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
                <KeyboardAwareScrollView refreshControl={_RefreshControl}>
                    {!this.driveSelected && !driveStore.hasRentals && (
                        <View
                            style={{
                                paddingTop: dims.CONTENT_PADDING_TOP,
                                paddingHorizontal:
                                    dims.CONTENT_PADDING_HORIZONTAL,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    alignContent: 'center',
                                    backgroundColor: colors.CARD_BACKGROUND.string(),
                                    borderRadius: 8,
                                    padding: 20,
                                }}
                            >
                                <UFOText
                                    h1
                                    bold
                                    center
                                    style={{ paddingTop: 10 }}
                                >
                                    {t('home:reserve', {
                                        user: registerStore.user,
                                    })}
                                </UFOText>
                                <UFOText
                                    h1
                                    bold
                                    center
                                    style={{ paddingTop: 5 }}
                                >
                                    {t('home:register', {
                                        user: registerStore.user,
                                    })}
                                </UFOText>
                                <UFOText
                                    h1
                                    bold
                                    center
                                    style={{ paddingTop: 5 }}
                                >
                                    {t('home:drive', {
                                        user: registerStore.user,
                                    })}
                                </UFOText>
                            </View>
                        </View>
                    )}
                    {driveStore.hasRentals && driveStore.rental && (
                        <View style={{ paddingTop: dims.CONTENT_PADDING_TOP }}>
                            <UFOSlider
                                data={driveStore.rentals}
                                renderItem={this.renderRental}
                                onSnapToItem={this.selectRental}
                                firstItem={driveStore.index}
                            />
                        </View>
                    )}
                    {this.driveSelected && !driveStore.rental && (
                        <View
                            style={{
                                paddingTop: dims.CONTENT_PADDING_TOP,
                                paddingHorizontal:
                                    dims.CONTENT_PADDING_HORIZONTAL,
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignContent: 'center',
                            }}
                        >
                            <UFOCard
                                title={t('drive:noRentalsTitle')}
                                text={t('drive:noRentalsDescription')}
                            />
                        </View>
                    )}
                </KeyboardAwareScrollView>
                <UFOActionBar
                    actions={this.compileActions()}
                    activityPending={this.activityPending}
                />
            </UFOContainer>
        );
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
                onPress: () => navigation.navigate(screenKeys.Booking),
            });
            actions.push({
                style: registerStore.isUserRegistered
                    ? actionStyles.DONE
                    : actionStyles.TODO,
                icon: registerStore.isUserRegistered
                    ? icons.MY_DETAILS
                    : icons.REGISTER,
                onPress: () => navigation.navigate(screens.REGISTER.name),
            });
            actions.push({
                style: driveStore.hasRentalOngoing
                    ? actionStyles.TODO
                    : actionStyles.ACTIVE,
                icon: icons.DRIVE,
                onPress: () => (this.driveSelected = true),
            });
        } else if (this.driveSelected && !this.returnSelected) {
            /* back btn on drive screen */
            actions.push({
                style: actionStyles.ACTIVE,
                icon: icons.BACK,
                onPress: () => (this.driveSelected = false),
            });

            if (!driveStore.hasRentals) {
                /* we see this when rentals list is empty */
                actions.push({
                    style: actionStyles.DISABLE,
                    icon: icons.FIND,
                    onPress: () => null,
                });
                actions.push({
                    style: actionStyles.DISABLE,
                    icon: icons.INSPECT,
                    onPress: () => null,
                });
                actions.push({
                    style: actionStyles.DISABLE,
                    icon: icons.RENTAL_AGREEMENT,
                    onPress: () => null,
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
                    this.props.navigation.navigate(
                        screens.RENTAL_AGREEMENT.name
                    )
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
                        onPress: () => (this.returnSelected = true),
                    });
                }
            }
        } else {
            /* we see this after press "return" btn */
            actions.push({
                style: actionStyles.ACTIVE,
                icon: icons.BACK,
                onPress: () => (this.returnSelected = false),
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
            await otaKeyStore.enableKey(driveStore.rental.key_id, false);
            await otaKeyStore.switchToKey(false);
        }
    };

    refreshRental = async () => {
        this.activityPending = true;
        await appStore.initialise();
        await driveStore.reset();
        await this.doEnableAndSwitch();
        this.activityPending = false;
    };

    doCloseRental = async () => {
        this.activityPending = true;
        await otaKeyStore.lockDoors(false, false);
        await otaKeyStore.endKey();
        await driveStore.closeRental();
        this.returnSelected = false;
        this.driveSelected = false;
        this.activityPending = false;
    };

    doEnableKey = async () => {
        this.activityPending = true;
        driveStore.refreshRental();

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

        if (checkConnectivity) await this.doEnableAndSwitch();

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

        if (checkConnectivity) await this.doEnableAndSwitch();

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
}

export default translate('translations')(DriveScreen);
