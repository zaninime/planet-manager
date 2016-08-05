# ELOS Planet adventures
**Work in progress!**

This documents recaps briefly the information needed to develop good code that correctly identified models, features and bugs of the Planet lamps series.

## Models
There are three models:

* *PlanetPRO* (`productId=16`)
* *PlanetCompact* (`productId=16`, WTF!)
* *PlanetStella* (`productId=...`, waiting for docs)

They all feature NFC "connectivity", while Wi-Fi is optional on the *PlanetPRO* and *PlanetCompact* models. Owners that want Wi-Fi, they have to buy the external module called *WiFish*. *PlanetStella* features an integrated ESP8266 802.11n module!

### PlanetPRO
This lamp is the longest one. With over 120 W of LED lighting, it will definitely burn all of your fishes and corals. Be prepared.

Features common to all versions:
* Channel mapping of 12 strips (`CHANNEL_MAPPING`, not sure if this is actually a feature, though)
* Fan parameters (`FAN_CONFIG`)
* Temperature parameters (`TEMPERATURE_CONFIG`)

Versions:
* Version 1: software master/slave switch (`MASTER_SWITCH`, again not a real feature), firmware version numbers are in the 100-199 range. They suffer from the short-slope ('EARLY_DUSK') bug (given a slope of *n* minutes, the lamp starts and finishes the ramp *n* minutes earlier than the configured value).
* Version 2: hardware master/slave switch, *TODO: firmware versions not yet documented*.

### PlanetCompact
This lamp is identical to the PRO v1 model besides the reduced number of strips, 6.

*TODO: check if a version 2 actually exists.*

### PlanetStella
This is the latest entry in the family. *More information needs to be gathered on it.*
