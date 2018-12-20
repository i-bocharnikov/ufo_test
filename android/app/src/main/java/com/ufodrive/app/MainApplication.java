package com.ufodrive.app;

import com.facebook.react.ReactApplication;
import im.shimo.react.prompt.RNPromptPackage;
import io.codebakery.imagerotate.ImageRotatePackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import org.reactnative.camera.RNCameraPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.otakeys.sdk.OtaKeysApplication;
import com.cardio.RNCardIOPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.gettipsi.stripe.StripeReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends OtaKeysApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNPromptPackage(),
            new ImageRotatePackage(),
            new ReactNativeExceptionHandlerPackage(),
            new RNSensitiveInfoPackage(),
            new FastImageViewPackage(),
            new RNCameraPackage(),
            new RNFetchBlobPackage(),
            new ReactVideoPackage(),
            new OTAKeyPackage(),
            new RNDeviceInfo(),
            new RNCardIOPackage(),
            new LinearGradientPackage(),
            new StripeReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
     SoLoader.init(this, /* native exopackage */ false);
  }
}
