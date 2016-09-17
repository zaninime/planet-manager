import * as fromDaylight from './daylight';
import * as fromTimings from './timings';
import * as fromTwilight from './twilight';
import * as fromNight from './night';
import * as fromTemperature from './temperature';
import * as fromFan from './fan';
import * as fromChannels from './channels';
import * as fromWifi from './wifi';
import * as fromManaged from './managed';
import * as fromAddressing from './addressing';

// actions
export const SET_SAVED = 'lampConfig/configSaved/SET_SAVED';

const configSaved = (state = { overall: true, wifi: true }, action) => {
  switch (action.type) {
  case fromDaylight.SET_COLOR:
  case fromDaylight.SET_INTENSITY:
  case fromTimings.SET_TIMER_START:
  case fromTimings.SET_TIMER_END:
  case fromTwilight.SET_RED_LEVEL:
  case fromNight.SET_COLOR:
  case fromNight.SET_INTENSITY:
  case fromTemperature.SET_START_TEMPERATURE:
  case fromFan.SET_MAX_SPEED:
  case fromChannels.NEXT_COLOR:
  case fromChannels.TOGGLE_ENABLE:
  case fromChannels.TOGGLE_DISABLE:
    return { ...state, overall: false };
  case fromWifi.SET_MODE:
  case fromWifi.SET_SSID:
  case fromManaged.SET_PASSWORD:
  case fromManaged.TOGGLE_DHCP:
  case fromAddressing.SET_IP:
  case fromAddressing.SET_NETMASK:
  case fromAddressing.SET_GATEWAY:
    return { overall: false, wifi: false };
  case SET_SAVED:
    return { overall: true, wifi: true };
  default:
    return state;
  }
};

export default configSaved;

// action creators
export const setConfiSaved = (lampId) => ({ type: SET_SAVED, lampId });

// selectors
export const isConfigSaved = (state) => state.overall;
export const isWifiConfigSaved = (state) => state.wifi;
