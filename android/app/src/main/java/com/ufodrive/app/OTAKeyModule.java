package com.ufodrive.app;

import android.bluetooth.BluetoothAdapter;
import android.content.Intent;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.otakeys.sdk.OtaKeysApplication;
import com.otakeys.sdk.core.tool.OtaLogger;
import com.otakeys.sdk.service.OtaKeysService;
import com.otakeys.sdk.service.api.callback.AuthenticateCallback;
import com.otakeys.sdk.service.api.callback.EnableKeyCallback;
import com.otakeys.sdk.service.api.callback.EndKeyCallback;
import com.otakeys.sdk.service.api.callback.GetKeyCallback;
import com.otakeys.sdk.service.api.callback.SyncVehicleDataCallback;
import com.otakeys.sdk.service.api.enumerator.ApiCode;
import com.otakeys.sdk.service.api.enumerator.HttpStatus;
import com.otakeys.sdk.service.ble.callback.BleConnectionCallback;
import com.otakeys.sdk.service.ble.callback.BleDisableEngineCallback;
import com.otakeys.sdk.service.ble.callback.BleDisconnectionCallback;
import com.otakeys.sdk.service.ble.callback.BleEnableEngineCallback;
import com.otakeys.sdk.service.ble.callback.BleListener;
import com.otakeys.sdk.service.ble.callback.BleLockDoorsCallback;
import com.otakeys.sdk.service.ble.callback.BleUnlockDoorsCallback;
import com.otakeys.sdk.service.ble.callback.BleVehicleDataCallback;
import com.otakeys.sdk.service.ble.enumerator.BleError;
import com.otakeys.sdk.service.ble.enumerator.BluetoothState;
import com.otakeys.sdk.service.core.callback.ServiceStateCallback;
import com.otakeys.sdk.service.core.callback.SwitchToKeyCallback;
import com.otakeys.sdk.service.object.DoorsState;
import com.otakeys.sdk.service.object.request.OtaKeyRequest;
import com.otakeys.sdk.service.object.request.OtaSessionRequest;
import com.otakeys.sdk.service.object.response.OtaKey;
import com.otakeys.sdk.service.object.response.OtaLastVehicleData;
import com.otakeys.sdk.service.object.response.OtaOperation;
import com.otakeys.sdk.service.object.response.OtaState;
import com.otakeys.sdk.service.object.response.OtaVehicleData;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;

import javax.annotation.Nullable;


public class OTAKeyModule extends ReactContextBaseJavaModule implements BleListener {

    private static String DATE_TIME_ISO = "yyyy-MM-dd'T'HH:mm:ss'Z'";

    private static OtaKey LAST_ENABLED_KEY = null;

    public OTAKeyModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private OtaKeysApplication getOtaSdk() {
        return ((OtaKeysApplication) getReactApplicationContext().getApplicationContext());
    }

    private String convert(DateTime date)  {
        if(date == null){
            return null;
        }
        return date.toString(DateTimeFormat.forPattern(DATE_TIME_ISO));

    }

        private WritableMap convert(OtaKey otaKey) {

        WritableMap otaKeyMap = Arguments.createMap();
        otaKeyMap.putString("keyId", String.valueOf(otaKey.getOtaId()));
        otaKeyMap.putString("beginDate", convert(otaKey.getBeginDate()));
        otaKeyMap.putString("endDate", convert(otaKey.getEndDate()));
        otaKeyMap.putDouble("mileageLimit", otaKey.getMileageLimit());
        otaKeyMap.putString("extId", otaKey.getExtId());
        otaKeyMap.putBoolean("isEnabled", otaKey.isEnabled());
        otaKeyMap.putBoolean("isUsed", otaKey.isUsed());
        otaKeyMap.putString("keyArgs", otaKey.getKeyArgs());
        otaKeyMap.putString("keySensitiveArgs", otaKey.getKeySensitiveArgs());
        return otaKeyMap;
    }


    private WritableMap convert(OtaVehicleData otaVehicleData) {

        WritableMap otaKeyMap = Arguments.createMap();
        otaKeyMap.putString("date", convert(otaVehicleData.getDate()));
        otaKeyMap.putDouble("mileageStart", otaVehicleData.getMileageStart());
        otaKeyMap.putDouble("mileageCurrent", otaVehicleData.getMileageCurrent());
        otaKeyMap.putString("distanceType", otaVehicleData.getDistanceType() != null ? otaVehicleData.getDistanceType().name() : null);
        otaKeyMap.putString("energyType", otaVehicleData.getEnergyType() != null ? otaVehicleData.getEnergyType().name() : null);
        otaKeyMap.putDouble("batteryVoltage", otaVehicleData.getBatteryVoltage());
        otaKeyMap.putDouble("activeDtcErrorCode", otaVehicleData.getActiveDtcErrorCode());
        otaKeyMap.putBoolean("connectedToCharger", otaVehicleData.isConnectedToCharger());
        otaKeyMap.putDouble("energyStart", otaVehicleData.getEnergyStart());
        otaKeyMap.putDouble("energyCurrent", otaVehicleData.getEnergyCurrent());
        otaKeyMap.putBoolean("engineRunning", otaVehicleData.isEngineRunning());
        otaKeyMap.putBoolean("doorsLocked", otaVehicleData.isDoorsLocked());
        otaKeyMap.putBoolean("malfunctionIndicatorLamp", otaVehicleData.isMalfunctionIndicatorLamp());
        otaKeyMap.putDouble("gpsLatitude", otaVehicleData.getGpsLatitude());
        otaKeyMap.putDouble("gpsLongitude", otaVehicleData.getGpsLongitude());
        otaKeyMap.putDouble("gpsAccuracy", otaVehicleData.getGpsAccuracy());
        otaKeyMap.putString("gpsCaptureDate", convert(otaVehicleData.getGpsCaptureDate()));
        otaKeyMap.putDouble("mileageCurrent", otaVehicleData.getMileageCurrent());
        otaKeyMap.putDouble("mileageCurrent", otaVehicleData.getMileageCurrent());
        otaKeyMap.putDouble("sdkGpsLatitude", otaVehicleData.getSdkGpsLatitude());
        otaKeyMap.putDouble("sdkGpsLongitude", otaVehicleData.getSdkGpsLongitude());
        otaKeyMap.putDouble("sdkGpsAccuracy", otaVehicleData.getSdkGpsAccuracy());
        otaKeyMap.putString("sdkGpsCaptureDate", convert(otaVehicleData.getSdkGpsCaptureDate()));
        otaKeyMap.putString("fuelUnit", otaVehicleData.getFuelUnit() != null ? otaVehicleData.getFuelUnit().name() : null);
        otaKeyMap.putString("odometerUnit", otaVehicleData.getOdometerUnit() != null ? otaVehicleData.getOdometerUnit().name() : null);
        otaKeyMap.putBoolean("isBleCaptured", otaVehicleData.isBleCaptured());
        otaKeyMap.putString("operationCode", otaVehicleData.getOperationCode() != null ? otaVehicleData.getOperationCode().name() : null);
        otaKeyMap.putString("doorsState", otaVehicleData.getDoorsState() != null ? otaVehicleData.getDoorsState().name() : null);
        otaKeyMap.putString("operationState", otaVehicleData.getOperationState() != null ? otaVehicleData.getOperationState().name() : null);
        return otaKeyMap;
    }

    private WritableMap convert(OtaLastVehicleData otaVehicleData) {

        WritableMap otaKeyMap = Arguments.createMap();
        otaKeyMap.putString("energyType", otaVehicleData.getEnergyType() != null ? otaVehicleData.getEnergyType().name() : null);
        otaKeyMap.putDouble("batteryVoltage", otaVehicleData.getBatteryVoltage());
        otaKeyMap.putBoolean("connectedToCharger", otaVehicleData.isConnectedToCharger());
        otaKeyMap.putBoolean("engineRunning", otaVehicleData.isEngineRunning());
        otaKeyMap.putBoolean("doorsLocked", otaVehicleData.getDoorsState() == DoorsState.LOCKED);
        otaKeyMap.putBoolean("malfunctionIndicatorLamp", otaVehicleData.isMalfunctionIndicatorLamp());
        otaKeyMap.putDouble("gpsLatitude", otaVehicleData.getGpsLatitude());
        otaKeyMap.putDouble("gpsLongitude", otaVehicleData.getGpsLongitude());
        otaKeyMap.putDouble("sdkGpsLatitude", otaVehicleData.getSdkGpsLatitude());
        otaKeyMap.putDouble("sdkGpsLongitude", otaVehicleData.getSdkGpsLongitude());
        otaKeyMap.putDouble("sdkGpsAccuracy", otaVehicleData.getSdkGpsAccuracy());
        otaKeyMap.putString("fuelUnit", otaVehicleData.getFuelUnit() != null ? otaVehicleData.getFuelUnit().name() : null);
        otaKeyMap.putString("odometerUnit", otaVehicleData.getOdometerUnit() != null ? otaVehicleData.getOdometerUnit().name() : null);
        otaKeyMap.putString("doorsState", otaVehicleData.getDoorsState() != null ? otaVehicleData.getDoorsState().name() : null);
        return otaKeyMap;
    }



    @Override
    public String getName() {
        return "OTAKeyModule";
    }

    @ReactMethod
    public void register(int registrationNumber, final Promise promise) {
        try {
            OtaLogger.setDebugMode(true);

            getOtaSdk().getBle().registerBleEvents(registrationNumber, this);

            /*Intent service = new Intent(getReactApplicationContext().getApplicationContext(), ExportUserExperienceService.class);
            Bundle bundle = new Bundle();

            bundle.putString("test", "ok");
            service.putExtras(bundle);

            getReactApplicationContext().getApplicationContext().startService(service);*/

            getOtaSdk().setOnListenService(new ServiceStateCallback() { 
                @Override
                public void onServiceReady(OtaKeysService service) {
                    promise.resolve(true);
                }
            });            
        }catch(Exception e) {
            promise.reject(e);
        }
        return;
    }


    /**
     * Return an instance of Access Device Token.
     * Once first called, this method will always return the same result.
     * If force, Once first called, this method will always return A NEW result.
     *
     * @return Promise with a unique instance of Access Device Id
     * @since 1.0
     *
     * Internet Connectivity Required
     */
    @ReactMethod
    public void getAccessDeviceToken(boolean force, final Promise promise) {
        try {
            String accessDeviceToken = getOtaSdk().getCore().getAccessDeviceToken(force);
            promise.resolve(accessDeviceToken);
        }catch(Exception e) {
            promise.reject(e);
        }
        return;
    }


    /**
     * If using AccessDevice and AccessDeviceId already registered in OTA keys middleware,
     * open a session to let the SDK communicate with OTA keys middleware.
     * @param otaSessionToken the ota session request
     * @param promise
     * @since 1.0
     *
     * Internet Connectivity Required
     */
    @ReactMethod
    public void openSession(String otaSessionToken, final Promise promise ) {

        if(otaSessionToken == null){
            promise.reject("Input Invalid", "otaSessionToken ["+otaSessionToken+"] is required");
            return;
        }


        OtaSessionRequest otaSessionRequest = new OtaSessionRequest.AccessDeviceBuilder(otaSessionToken).create();
        getOtaSdk().getCore().openSession(
                otaSessionRequest,
                new AuthenticateCallback() {

                    @Override
                    public void onAuthenticated() {
                        promise.resolve(true);
                    }

                    @Override
                    public void onApiError(HttpStatus httpStatus, ApiCode errorCode) {
                        promise.reject(errorCode.name(), httpStatus.name());
                    }
                });
        return;
    }

    /**
     * Get a key
     *
     * @param otaKeyId the ota key created by ufodrive to control the vehicle
     * @param promise
     *
     * @since 1.0
     *
     * Internet Connectivity Required
     */
    @ReactMethod
    public void getKey(String otaKeyId, final Promise promise ) {

        if(otaKeyId == null){
            promise.reject("Input Invalid", "otaKeyId ["+otaKeyId+"] is required");
            return;
        }


        OtaKeyRequest otaKeyRequest = new OtaKeyRequest.EnableKeyBuilder(Long.parseLong(otaKeyId)).create();
        getOtaSdk().getApi().getKey(otaKeyRequest, new GetKeyCallback() {
            @Override
            public void onGetKey(OtaKey otaKey) {
                promise.resolve(convert(otaKey));
                return;
            }
            @Override
            public void onApiError(HttpStatus httpStatus, ApiCode errorCode) {
                promise.reject(errorCode.name(), httpStatus.name());
                return;
            }
        });
        return;
    }

    /**
     * Enable a previously created,
     *
     * @param otaKeyId the ota key created by ufodrive to control the vehicle
     * @param promise
     *
     * @since 1.0
     *
     * Internet Connectivity Required
     */
    @ReactMethod
    public void enableKey(String otaKeyId, final Promise promise  ) {


        if(otaKeyId == null){
            promise.reject("Input Invalid", "otaKeyId ["+otaKeyId+"] is required");
            return;
        }

        OtaKeyRequest otaKeyRequest = new OtaKeyRequest.EnableKeyBuilder(Long.parseLong(otaKeyId)).create();
        getOtaSdk().getApi().enableKey(otaKeyRequest, new EnableKeyCallback() {
            @Override
            public void onEnableKey(OtaKey otaKey) {
                LAST_ENABLED_KEY = otaKey;
                promise.resolve(convert(otaKey));
            }
            @Override
            public void onApiError(HttpStatus httpStatus, ApiCode errorCode) {
                promise.reject(errorCode.name(), httpStatus.name());
            }
        });
        return;
    }

    /**
     * End a key, meaning that the user won't be able any more to use this key to interact with the vehicle
     *
     * @param otaKeyId the ota key created by ufodrive to control the vehicle
     * @param promise
     *
     * @since 1.0
     *
     * Internet Connectivity Required
     */
    @ReactMethod
    public void endKey(String otaKeyId, final Promise promise  ) {

        if(otaKeyId == null){
            promise.reject("Input Invalid", "otaKeyId ["+otaKeyId+"] is required");
            return;
        }


        OtaKeyRequest otaKeyRequest = new OtaKeyRequest.EndKeyBuilder(Long.parseLong(otaKeyId)).create();
        getOtaSdk().getApi().endKey(otaKeyRequest, new EndKeyCallback() {
            @Override
            public void onEndKey(OtaKey otaKey) {
                promise.resolve(convert(otaKey));
            }
            @Override
            public void onApiError(HttpStatus httpStatus, ApiCode errorCode) {
                promise.reject(errorCode.name(), httpStatus.name());
            }
        });
        return;
    }


    /**
     * Switch to key
     * If there is a need to switch to another enabled key, this method will switch from one enabled key to the asked one.
     * If the previous key, the SDK was connected to the CSM, this method will ensure to disconnect first before switching to the new key but no automatic connection to the new CSM key.
     *
     * @param otaKey the ota key created by ufodrive and enabled to control the vehicle
     * @param promise
     *
     * @since 1.0
     *
     * No Internet Connectivity Required
     */
    @ReactMethod
    public void switchToKey( final Promise promise  ) {

        try {
            getOtaSdk().getCore().switchToKey(LAST_ENABLED_KEY, new SwitchToKeyCallback() {
                @Override
                public void onKeySwitched(OtaKey otaKey) {
                     promise.resolve(convert(otaKey));
                }

            });
        }catch(NullPointerException exception){
            promise.reject(exception);
        }
        return;
    }

    /**
     * Force to send non synchronized vehicle data to OTA keys middleware, otherwise this data will be
     * synchronized while ending the key
     *
     * @param promise
     *
     * @since 1.0
     *
     * Internet Connectivity Required
     */
    @ReactMethod
    public void syncVehicleData(final Promise promise) {

        getOtaSdk().getApi().syncVehicleData(new SyncVehicleDataCallback() {
            @Override
            public void onVehicleDataSync() {
                promise.resolve(true);

            }
            @Override
            public void onApiError(HttpStatus httpStatus, ApiCode errorCode) {
                promise.reject(errorCode.name(), httpStatus.name());
            }
        });
        return;
    }

    /**
     * Configure the connect and read timeout values when performing network API calls to OTA keys backend.
     * Connect timeout: attempt to connect did not succeed before limit.
     * Read timeout: response timeout = no data received before limit.
     *
     * @param connectTimeout the connect timeout value (Min:8, Max:60)
     * @param readTimeout the read timeout value (Min:8: Max:60)
     * @return Promise true or false depending if timeout have been applied correctly or not
     *
     *
     * No Internet Connectivity Required
     */
    @ReactMethod
    public void configureNetworkTimeouts(int connectTimeout, int readTimeout, final Promise promise ) {
        try{
            boolean result = getOtaSdk().getCore().configureNetworkTimeouts(connectTimeout, readTimeout);
            promise.resolve(result);
        }catch(Exception e) {
            promise.reject(e);
        }
        return;

}

    /**
     * Get the enabled and used key for BLE communication.
     * @return Primise the {@link OtaKey} if used or {@code null} if no one
     *
     *
     * No Internet Connectivity Required
     */
    @ReactMethod
    public void getUsedKey(final Promise promise) {

        try{
            OtaKey otaKey = getOtaSdk().getCore().getUsedKey();
            promise.resolve(convert(otaKey));
        }catch(Exception e) {
            promise.reject(e);
        }
        return;
    }


    /**
     * Is connected to vehicle boolean.
     *
     * @return Promise the boolean
     * @since 1.4
     *
     * No Internet Connectivity Required
     * NO Bluetooth Connectivity Required
     */
    @ReactMethod
    public void isConnectedToVehicle(final Promise promise){
        try{
            boolean result = getOtaSdk().getBle().isConnectedToVehicle();
            promise.resolve(result);
        }catch(Exception e) {
            promise.reject(e);
        }
        return;
    }

    /**
     * A more detailed version of the bluetooth state method is the one below. This method returns you intermediate state as connecting, scanning or disconnecting in addition to connected and disconnected.
     *
     * Return the Bluetooth state
     * @return Promise the Bluetooth state: CONNECTING, CONNECTED,  DISCONNECTING, DISCONNECTED, SCANNING;
     * @since 1.5
     *
     * No Internet Connectivity Required
     * No Bluetooth Connectivity Required
     */
    @ReactMethod
    public void getBluetoothState(final Promise promise){
        try{
            String result = getOtaSdk().getBle().getBluetoothState().name();
            promise.resolve(result);
        }catch(Exception e) {
            promise.reject(e);
        }
        return;
    }


    /**
     * An operation is already in progress
     *
     * @return Promise the boolean
     * @since 1.5
     *
     * No Internet Connectivity Required
     * No Bluetooth Connectivity Required
     */
    @ReactMethod
    public void isOperationInProgress(final Promise promise){
        try{
            boolean result = getOtaSdk().getBle().isOperationInProgress();
            promise.resolve(result);
        }catch(Exception e) {
            promise.reject(e);
        }
        return;
    }


    /**
     * Start a scanning process to try to connect to the vehicle, result will be triggered in the {@code ConnectionCallback}
     *
     * @param showNotification a boolean to show or not the notification in status bar * @param bleConnectionCallback {@link BleConnectionCallback}
     * @since 1.0
     *
     * No Internet Connectivity Required
     * Bluetooth Connectivity Required
     */
    @ReactMethod
    void connect(boolean showNotification, final Promise promise){

        try {

            BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
            if (mBluetoothAdapter == null) {
                promise.reject("Device not supported", "This device does not support bluetooth connection");
                return;
            }

            if (!mBluetoothAdapter.isEnabled()) {
                Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                getCurrentActivity().startActivityForResult(enableBtIntent, 90);
            }


            getOtaSdk().getBle().connect(showNotification, new BleConnectionCallback() {
                @Override
                public void onConnected() {
                        promise.resolve(true);
                }

                @Override
                public void onBleError(BleError errorCode) {
                    try {
                        promise.reject(errorCode.name(), errorCode.toString());
                    }catch(Exception e){}
                }
            });
        }catch(java.lang.IllegalStateException exception){
            silentException(exception);
        }
        return;
    }

    /**
     * Start the disconnection process, result will be triggered in the {@code DisconnectionCallback}
     * @since 1.0
     *
     * No Internet Connectivity Required
     * Bluetooth Connectivity Required
     */
    @ReactMethod
    void disconnect(final Promise promise){

        try {
            getOtaSdk().getBle().disconnect(new BleDisconnectionCallback() {
                @Override
                public void onDisconnected() {
                    promise.resolve(true);
                }

                @Override
                public void onBleError(BleError errorCode) {
                    promise.reject(errorCode.name(), errorCode.toString());
                }
            });
        }catch(java.lang.IllegalStateException exception){
            silentException(exception);
        }
        return;
    }





    /**
     * Request to unlock the vehicle doors, this method takes two parameters. The first one if the
     * vehicle information are needed in the callback, and the second the callback. If the action
     * can be processed according to the current bluetooth connection state, etc ... the return
     * boolean will be set to true, false otherwise.
     *
     * @param requestVehicleData If vehicle data is needed, {@code requestVehicleData} need to be set to true, false otherwise.
     * @param authStart If authorization to start the engine is needed true, false otherwise.
     *
     * @since 1.0
     *
     * No Internet Connectivity Required
     * Bluetooth Connectivity Required
     */
    @ReactMethod
    void unlockDoors(boolean requestVehicleData, boolean authStart, final Promise promise){

        try {
            getOtaSdk().getBle().unlockDoors(requestVehicleData, authStart, new BleUnlockDoorsCallback() {



                public void onUnlockPerformed(boolean result) {
                    promise.resolve(result);
                }

                public void onVehicleDataUpdated(OtaVehicleData otaVehicleData) {
                    sendEvent(getReactApplicationContext(), "onOtaVehicleDataUpdated", convert(otaVehicleData));
                }

                @Override
                public void onBleError(BleError errorCode) {
                    promise.reject(errorCode.name(), errorCode.toString());
                }
            });
        }catch(java.lang.IllegalStateException exception){
            silentException(exception);
        }
        return;
    }


    /**
     * Request to lock the vehicle doors, this method takes two parameters. The first one if the
     * vehicle information are needed in the callback, and the second the callback. If the action
     * can be processed according to the current bluetooth connection state, etc ... the return
     * boolean will be set to true, false otherwise.
     *
     * @param requestVehicleData If vehicle data is needed, {@code requestVehicleData} need to be set to true, false otherwise.
     * @since 1.0
     *
     * No Internet Connectivity Required
     * Bluetooth Connectivity Required
     */
    @ReactMethod
    void lockDoors(boolean requestVehicleData, final Promise promise){

        try {
            getOtaSdk().getBle().lockDoors(requestVehicleData, new BleLockDoorsCallback() {

                public void onLockPerformed(boolean result) {
                    promise.resolve(result);
                }

                public void onVehicleDataUpdated(OtaVehicleData otaVehicleData) {
                    sendEvent(getReactApplicationContext(), "onOtaVehicleDataUpdated", convert(otaVehicleData));
                }

                @Override
                public void onBleError(BleError errorCode) {
                    promise.reject(errorCode.name(), errorCode.toString());
                }
            });
        }catch(java.lang.IllegalStateException exception){
            silentException(exception);
        }
        return;
    }


    /**
     * Once connected to the vehicle, you will be able to enable the vehicle engine
     *
     * @param requestVehicleData If vehicle data is needed, {@code requestVehicleData} need to be set to true, false otherwise.
     * @since 1.0
     *
     * No Internet Connectivity Required
     * Bluetooth Connectivity Required
     */
    @ReactMethod
    void enableEngine(boolean requestVehicleData, final Promise promise){

        try {
            getOtaSdk().getBle().enableEngine(requestVehicleData, new BleEnableEngineCallback() {

                @Override
                public void onEnableEngine() {
                    promise.resolve(true);
                }

                public void onVehicleDataUpdated(OtaVehicleData otaVehicleData) {
                    sendEvent(getReactApplicationContext(), "onOtaVehicleDataUpdated", convert(otaVehicleData));
                }

                @Override
                public void onBleError(BleError errorCode) {
                    promise.reject(errorCode.name(), errorCode.toString());
                }
            });
        }catch(java.lang.IllegalStateException exception){
            silentException(exception);
        }
        return;
    }

    /**
     * Once connected to the vehicle, you will be able to disableEngine the vehicle engine
     *
     * @param requestVehicleData If vehicle data is needed, {@code requestVehicleData} need to be set to true, false otherwise.
     * @since 1.0
     *
     * No Internet Connectivity Required
     * Bluetooth Connectivity Required
     */
    @ReactMethod
    void disableEngine(boolean requestVehicleData, final Promise promise){

        try {
            getOtaSdk().getBle().disableEngine(requestVehicleData, new BleDisableEngineCallback() {


                @Override
                public void onDisableEngine() {
                    promise.resolve(true);
                }

                public void onVehicleDataUpdated(OtaVehicleData otaVehicleData) {
                    sendEvent(getReactApplicationContext(), "onOtaVehicleDataUpdated", convert(otaVehicleData));
                }

                @Override
                public void onBleError(BleError errorCode) {
                    promise.reject(errorCode.name(), errorCode.toString());
                }
            });
        }catch(java.lang.IllegalStateException exception){
            silentException(exception);
        }
        return;
    }

    /**
     * Request to get only the vehicle information directly from the vehicle without doing any operation on it.
     *
     * @since 1.0
     *
     * No Internet Connectivity Required
     * Bluetooth Connectivity Required
     */
    @ReactMethod
    void getVehicleData(final Promise promise){

        try {
            getOtaSdk().getBle().getVehicleData(new BleVehicleDataCallback() {

                public void onVehicleDataUpdated(OtaLastVehicleData otaVehicleData) {
                    promise.resolve(true);
                    sendEvent(getReactApplicationContext(), "onOtaVehicleDataUpdated", convert(otaVehicleData));
                }

                @Override
                public void onBleError(BleError errorCode) {
                    promise.reject(errorCode.name(), errorCode.toString());
                }
            });
        }catch(java.lang.IllegalStateException exception){
            silentException(exception);
        }
        return;
    }



    @ReactMethod
    public void check() {
        String accessDeviceToken = getOtaSdk().getCore().getAccessDeviceToken();
        Toast.makeText(getReactApplicationContext(), "accessDeviceToken:"+accessDeviceToken, Toast.LENGTH_LONG).show();
    }

    private void silentException(Exception exception) {
        Toast.makeText(getReactApplicationContext(), "Silent Exception:"+exception.getLocalizedMessage(), Toast.LENGTH_LONG).show();
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        //Toast.makeText(getReactApplicationContext(), "event ["+eventName+"] sent", Toast.LENGTH_LONG).show();
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @Override
    public void onActionPerformed(OtaOperation otaOperation, OtaState otaState) {
        WritableMap map = Arguments.createMap();
        map.putString("otaOperation", otaOperation != null ? otaOperation.name() : null);
        map.putString("otaState", otaState != null ? otaState.name() : null);
        sendEvent(getReactApplicationContext(), "onOtaActionPerformed", map);
    }

    @Override
    public void onBluetoothStateChanged(BluetoothState newBluetoothState, BluetoothState previousBluetoothState1) {

        WritableMap map = Arguments.createMap();
        map.putString("newBluetoothState", newBluetoothState != null ? newBluetoothState.name() : null);
        map.putString("previousBluetoothState", previousBluetoothState1 != null ? previousBluetoothState1.name() : null);
        sendEvent(getReactApplicationContext(), "onOtaBluetoothStateChanged", map);
    }
}
