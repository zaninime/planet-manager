# Planet Manager

This repo contains the unified code for the ELOS app. All the UI code is shared across all the platforms, mobiles and desktops. We currently target:

* Android
* iOS
* Desktop (using Electron)

## Getting started

### Development for Desktop
Development is done using [Electron](http://electron.atom.io/) directly. Please follow [their docs](http://electron.atom.io/docs/) to setup Electron on your platform.

To run the development version, spawn two terminals and in the first type:

```
$ gulp electron:dev
```

while in the second:

```
$ electron electron/dev.js
```

### Development for Android
Android SDK is required. You need to compile the app changing a variable in `MainActivity.java`, in order to load the remote bundle served by Webpack.

First change the following line (please don't commit it):
```java
public class MainActivity extends AppCompatActivity {
    static final String PAGE = "file:///android_asset/web/index.html";
    //                          ^ http://YOUR_IP:3000/index.html

    // ...
}
```

Recompile:
```
$ gradle assembleDebug
```

Install to your emulator or device and start the Webpack development server:

```
$ gulp android:dev
```

### Development for iOS
You need to be on a Mac with Xcode 7. Instructions of what to edit in order to use the dev server are coming soon.

Recompile (you need [Fastlane Tools](https://fastlane.tools/)):
```
$ gym
```

Install to your emulator or device and start the Webpack development server:

```
$ gulp ios:dev
```


## Interface with the lamp
The lamp speaks a proprietary, inefficient and badly designed protocol that requires a TCP connection. Furthermore, there's an unofficial and unadvertised discovery protocol using UDP broadcast messages. The sockets are created differently based on the target class, mobile or Chrome.

* Mobile apps use native classes bridged into the WebView using the native API exposed by Android and iOS
* Desktop app takes advantage of the `dgram` and `net` modules natively compiled into Electron
