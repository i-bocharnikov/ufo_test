package com.driverapp;

import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.otakeys.sdk.OtaKeysApplication;
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
import com.otakeys.sdk.service.object.request.OtaKeyRequest;
import com.otakeys.sdk.service.object.request.OtaSessionRequest;
import com.otakeys.sdk.service.object.response.OtaKey;
import com.otakeys.sdk.service.object.response.OtaLastVehicleData;
import com.otakeys.sdk.service.object.response.OtaOperation;
import com.otakeys.sdk.service.object.response.OtaState;
import com.otakeys.sdk.service.object.response.OtaVehicleData;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

import javax.annotation.Nullable;


public class OTAKeyModule extends ReactContextBaseJavaModule implements BleListener {

    private int idBleEvent = 97019701;

    public OTAKeyModule(ReactApplicationContext reactContext) {
        super(reactContext);
        getOtaSdk().setOnListenService(new ServiceStateCallback() { @Override
            public void onServiceReady(OtaKeysService service) {

                Toast.makeText(getReactApplicationContext(), "OtaKeysService started!", Toast.LENGTH_LONG).show();

            }
        });
        getOtaSdk().getBle().registerBleEvents(idBleEvent, this);

    }

    public OtaKeysApplication getOtaSdk() {
        return ((OtaKeysApplication) getReactApplicationContext().getApplicationContext());
    }

    @Override
    public String getName() {
        return "OTAKeyModule";
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
    public void getKey(Long otaKeyId, final Promise promise ) {

        OtaKeyRequest otaKeyRequest = new OtaKeyRequest.EnableKeyBuilder(otaKeyId).create();
        getOtaSdk().getApi().getKey(otaKeyRequest, new GetKeyCallback() {
            @Override
            public void onGetKey(OtaKey otaKey) {
                try{
                    WritableMap otaKeyMap = convertJsonToMap(new JSONObject(createDefaultGson().toJson(otaKey)));
                    promise.resolve(otaKeyMap);
                } catch (JSONException e) {
                    promise.reject(e);
                }
            }
            @Override
            public void onApiError(HttpStatus httpStatus, ApiCode errorCode) {
                promise.reject(errorCode.name(), httpStatus.name());
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
    public void enableKey(Long otaKeyId, final Promise promise  ) {

        OtaKeyRequest otaKeyRequest = new OtaKeyRequest.EnableKeyBuilder(otaKeyId).create();
        getOtaSdk().getApi().enableKey(otaKeyRequest, new EnableKeyCallback() {
            @Override
            public void onEnableKey(OtaKey otaKey) {
                try{
                    WritableMap otaKeyMap = convertJsonToMap(new JSONObject(createDefaultGson().toJson(otaKey)));
                    promise.resolve(otaKeyMap);
                } catch (JSONException e) {
                    promise.reject(e);
                }
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
    public void endKey(Long otaKeyId, final Promise promise  ) {

        OtaKeyRequest otaKeyRequest = new OtaKeyRequest.EndKeyBuilder(otaKeyId).create();
        getOtaSdk().getApi().endKey(otaKeyRequest, new EndKeyCallback() {
            @Override
            public void onEndKey(OtaKey otaKey) {
                try{
                    WritableMap otaKeyMap = convertJsonToMap(new JSONObject(createDefaultGson().toJson(otaKey)));
                    promise.resolve(otaKeyMap);
                } catch (JSONException e) {
                    promise.reject(e);
                }
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
    public void switchToKey(OtaKey otaKey, final Promise promise  ) {

        try {
            getOtaSdk().getCore().switchToKey(otaKey, new SwitchToKeyCallback() {
                @Override
                public void onKeySwitched(OtaKey otaKey) {
                     try{
                        WritableMap otaKeyMap = convertJsonToMap(new JSONObject(createDefaultGson().toJson(otaKey)));
                        promise.resolve(otaKeyMap);
                    } catch (JSONException e) {
                         promise.reject(e);
                    }
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

            }            @Override
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
            WritableMap otaKeyMap = convertJsonToMap(new JSONObject(createDefaultGson().toJson(otaKey)));
            promise.resolve(otaKeyMap);
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
            getOtaSdk().getBle().connect(showNotification, new BleConnectionCallback() {
                @Override
                public void onConnected() {
                    promise.resolve(true);

                }

                @Override
                public void onBleError(BleError errorCode) {
                    promise.reject(errorCode.name(), errorCode.toString());
                }
            });
        }catch(java.lang.IllegalStateException exception){
            promise.reject(exception);
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
            promise.reject(exception);
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
                    try {
                        WritableMap vehicleDataMap = convertJsonToMap(new JSONObject(createDefaultGson().toJson(otaVehicleData)));
                        sendEvent(getReactApplicationContext(), "onOtaVehicleDataUpdated", vehicleDataMap);
                    } catch (JSONException e) {
                        silentException(e);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onBleError(BleError errorCode) {
                    promise.reject(errorCode.name(), errorCode.toString());
                }
            });
        }catch(java.lang.IllegalStateException exception){
            promise.reject(exception);
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
                    try {
                        WritableMap vehicleDataMap = convertJsonToMap(new JSONObject(createDefaultGson().toJson(otaVehicleData)));
                        sendEvent(getReactApplicationContext(), "onOtaVehicleDataUpdated", vehicleDataMap);
                    } catch (JSONException e) {
                        silentException(e);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onBleError(BleError errorCode) {
                    promise.reject(errorCode.name(), errorCode.toString());
                }
            });
        }catch(java.lang.IllegalStateException exception){
            promise.reject(exception);
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
                    try {
                        WritableMap vehicleDataMap = convertJsonToMap(new JSONObject(createDefaultGson().toJson(otaVehicleData)));
                        sendEvent(getReactApplicationContext(), "onOtaVehicleDataUpdated", vehicleDataMap);
                    } catch (JSONException e) {
                        silentException(e);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onBleError(BleError errorCode) {
                    promise.reject(errorCode.name(), errorCode.toString());
                }
            });
        }catch(java.lang.IllegalStateException exception){
            promise.reject(exception);
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
                    try {
                        WritableMap vehicleDataMap = convertJsonToMap(new JSONObject(createDefaultGson().toJson(otaVehicleData)));
                        sendEvent(getReactApplicationContext(), "onOtaVehicleDataUpdated", vehicleDataMap);
                    } catch (JSONException e) {
                        silentException(e);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onBleError(BleError errorCode) {
                    promise.reject(errorCode.name(), errorCode.toString());
                }
            });
        }catch(java.lang.IllegalStateException exception){
            promise.reject(exception);
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
                    try {
                        WritableMap vehicleDataMap = convertJsonToMap(new JSONObject(createDefaultGson().toJson(otaVehicleData)));
                        sendEvent(getReactApplicationContext(), "onOtaVehicleDataUpdated", vehicleDataMap);
                    } catch (JSONException e) {
                        silentException(e);
                        e.printStackTrace();
                    }
                }

                @Override
                public void onBleError(BleError errorCode) {
                    promise.reject(errorCode.name(), errorCode.toString());
                }
            });
        }catch(java.lang.IllegalStateException exception){
            promise.reject(exception);
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
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    private static Gson createDefaultGson() {
        GsonBuilder builder = new GsonBuilder();
        return builder.create();
    }

    private static WritableMap convertJsonToMap(JSONObject jsonObject) throws JSONException {
        WritableMap map = new WritableNativeMap();

        Iterator<String> iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);
            if (value instanceof JSONObject) {
                map.putMap(key, convertJsonToMap((JSONObject) value));
            } else if (value instanceof JSONArray) {
                map.putArray(key, convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                map.putBoolean(key, (Boolean) value);
            } else if (value instanceof  Integer) {
                map.putInt(key, (Integer) value);
            } else if (value instanceof  Double) {
                map.putDouble(key, (Double) value);
            } else if (value instanceof String)  {
                map.putString(key, (String) value);
            } else {
                map.putString(key, value.toString());
            }
        }
        return map;
    }

    private static WritableArray convertJsonToArray(JSONArray jsonArray) throws JSONException {
        WritableArray array = new WritableNativeArray();

        for (int i = 0; i < jsonArray.length(); i++) {
            Object value = jsonArray.get(i);
            if (value instanceof JSONObject) {
                array.pushMap(convertJsonToMap((JSONObject) value));
            } else if (value instanceof  JSONArray) {
                array.pushArray(convertJsonToArray((JSONArray) value));
            } else if (value instanceof  Boolean) {
                array.pushBoolean((Boolean) value);
            } else if (value instanceof  Integer) {
                array.pushInt((Integer) value);
            } else if (value instanceof  Double) {
                array.pushDouble((Double) value);
            } else if (value instanceof String)  {
                array.pushString((String) value);
            } else {
                array.pushString(value.toString());
            }
        }
        return array;
    }

    private static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
        JSONObject object = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Null:
                    object.put(key, JSONObject.NULL);
                    break;
                case Boolean:
                    object.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    object.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    object.put(key, readableMap.getString(key));
                    break;
                case Map:
                    object.put(key, convertMapToJson(readableMap.getMap(key)));
                    break;
                case Array:
                    object.put(key, convertArrayToJson(readableMap.getArray(key)));
                    break;
            }
        }
        return object;
    }

    private static JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {
        JSONArray array = new JSONArray();
        for (int i = 0; i < readableArray.size(); i++) {
            switch (readableArray.getType(i)) {
                case Null:
                    break;
                case Boolean:
                    array.put(readableArray.getBoolean(i));
                    break;
                case Number:
                    array.put(readableArray.getDouble(i));
                    break;
                case String:
                    array.put(readableArray.getString(i));
                    break;
                case Map:
                    array.put(convertMapToJson(readableArray.getMap(i)));
                    break;
                case Array:
                    array.put(convertArrayToJson(readableArray.getArray(i)));
                    break;
            }
        }
        return array;
    }

    @Override
    public void onActionPerformed(OtaOperation otaOperation, OtaState otaState) {
        try {
            WritableMap map = convertJsonToMap(new JSONObject(createDefaultGson().toJson(otaOperation)));
            WritableMap result = convertJsonToMap(new JSONObject(createDefaultGson().toJson(otaState)));
            map.putMap("result", result);
            sendEvent(getReactApplicationContext(), "onOtaActionPerformed", map);
        } catch (JSONException e) {
            silentException(e);
            e.printStackTrace();
        }
    }

    @Override
    public void onBluetoothStateChanged(BluetoothState newBluetoothState, BluetoothState previousBluetoothState1) {
        try {
            WritableMap map = convertJsonToMap(new JSONObject(createDefaultGson().toJson(newBluetoothState)));
            sendEvent(getReactApplicationContext(), "onOtaBluetoothStateChanged", map);
        } catch (JSONException e) {
            silentException(e);
            e.printStackTrace();
        }
    }
}
