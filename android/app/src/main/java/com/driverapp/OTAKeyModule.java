package com.driverapp;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;


public class OTAKeyModule extends ReactContextBaseJavaModule {

    public OTAKeyModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }


    @Override
    public String getName() {
        return "OTAKeyModule";
    }

    @ReactMethod
    public void check() {
        Toast.makeText(getReactApplicationContext(), "Integration Fully ok", Toast.LENGTH_LONG).show();
    }
}
