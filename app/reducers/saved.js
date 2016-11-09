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
export const SAVE_START = 'config/SAVE_START';
export const SAVE_COMPLETED = 'config/SAVE_COMPLETED';

const saved = (state = { lamp: true, wifi: true }, action) => {
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
        return { ...state, lamp: false };
    case fromWifi.SET_MODE:
    case fromWifi.SET_SSID:
    case fromManaged.SET_PASSWORD:
    case fromManaged.TOGGLE_DHCP:
    case fromAddressing.SET_IP:
    case fromAddressing.SET_NETMASK:
    case fromAddressing.SET_GATEWAY:
        return { ...state, wifi: false };
    case SAVE_COMPLETED:
        return { lamp: true, wifi: true };
    default:
        return state;
    }
};

export default saved;

// action creators
export const startSaving = lampId => ({ type: SAVE_START, lampId });
export const setConfigSaved = lampId => ({ type: SAVE_COMPLETED, lampId });

// selectors
export const isConfigSaved = state => state.lamp && state.wifi;
export const isLampConfigSaved = state => state.lamp;
export const isWifiConfigSaved = state => state.wifi;
