package com.safespend

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class ReactNativePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext) = listOf(
        ReactNativeModule(reactContext)
    )

    override fun createViewManagers(reactContext: ReactApplicationContext) = emptyList<ViewManager<*, *>>()
}