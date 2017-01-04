![ELOS Planet Manager](http://i.imgur.com/rE93ihu.png)
---
[![Get it on Google Play](http://i.imgur.com/ZRuMmTe.png)](https://play.google.com/store/apps/details?id=eu.elos.planetmgr.app) [![Download on the App Store](http://i.imgur.com/285bQeQ.png)](https://itunes.apple.com/it/app/planet-manager/id1031067585)

This repo contains the unified code for the ELOS app. All the UI code is shared across all the platforms, mobiles and desktops.

## Getting started

### Development for Desktop
Development is done directly through [Electron](http://electron.atom.io/). Please follow [their docs](http://electron.atom.io/docs/) to setup Electron on your platform.

To run the development version, run the Webpack development server:

```
$ npm run start
```

and simultaneously:

```
$ electron electron/dev.js
```

The development server has hot reloading and live reloading enabled. Save your changes and you’re going to see them immediately shipped to your local instance of Electron.

### Development for Android
Android SDK is required (O RLY?). If you want to enjoy the full power of the development server running on your machine, you need to change the assets URL in `MainActivity.java`.

1. Run the development server for Android:
```
$ npm run start-android
```

2. Change the following line (don't commit it):
```java
public class MainActivity extends AppCompatActivity {
    static final String PAGE = "file:///android_asset/web/index.html";
    //                          ^ http://YOUR_IP:3001/index.html

    // ...
}
```

3. Recompile and install to your device:
```
$ buck install :app-debug
```

You can also run `buck build :app-debug` to build the APK without installing.

### Development for iOS
You need to be on a Mac with Xcode 7. As for Android, a change in `FILENAME` is required in order to connect to the development server.

1. Run the development server for Android:
```
$ npm run start-ios
```

2. Uncomment `devURL` and `webView.load(devURL)` (don’t commit it):
```swift
class ViewController: UIViewController {
    override func viewDidLoad() {
        // ...

        let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "web")
        //let devURL = URLRequest(url: URL(string: "http://YOUR_IP:3002/")!)

        webView.loadFileURL(url!, allowingReadAccessTo: (url?.deletingLastPathComponent())!)
        //webView.load(devURL)

        self.view = webView
    }

    // ...

}
```

3. Recompile and install to your device (you need [Fastlane Tools](https://fastlane.tools/)) :
```
$ gym
```

## Interface with the lamp
The lamp speaks a proprietary, inefficient and badly designed protocol that requires a TCP connection. Furthermore, there's an unofficial and unadvertised discovery protocol using UDP broadcast messages. The sockets are created differently based on the target class, mobile or Electron.

* Mobile apps use native classes bridged into the WebView using the native API exposed by Android and iOS
* Desktop app takes advantage of the `dgram` and `net` modules natively compiled into Electron
