# Planet Manager

This repo contains the unified code for the ELOS app. All the UI code is shared across all the platforms, mobiles and desktops. We currently target:

* Android
* iOS
* Chrome (built as an app)

## Getting started
TODO

## Technologies involved
TODO

## Interface with the lamp
The lamp speaks a proprietary, inefficient and badly designed protocol that requires a TCP connection. Furthermore, there's an unofficial and unadvertised discovery protocol using UDP broadcast messages. The sockets are created differently based on the target class, mobile or Chrome.

* Mobile apps use a Cordova plugin that use native calls in Java and Objective-C
* Chrome app use the [*Network Communications*](https://developer.chrome.com/apps/app_network) module
