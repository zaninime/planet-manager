import { combineReducers } from 'redux';
import config, * as fromConfig from './config';
import wifi, * as fromWifi from './wifi';
import caps, * as fromCaps from './caps';
import saved, * as fromSaved from './saved';
import * as fromDaylight from './daylight';
import * as fromTimings from './timings';
import * as fromTwilight from './twilight';
import * as fromNight from './night';
import * as fromTemperature from './temperature';
import * as fromFan from './fan';
import * as fromChannels from './channels';
import * as fromManaged from './managed';
import * as fromAddressing from './addressing';
import * as fromFieldError from './fieldError';

const singleLamp = combineReducers({
    config,
    wifi,
    caps,
    saved,
});

const lamps = (state = { }, action) => {
    switch (action.type) {
  // yeah, just a few...
    case fromConfig.LOAD_COMPLETED:
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
    case fromWifi.SET_MODE:
    case fromWifi.SET_SSID:
    case fromManaged.SET_PASSWORD:
    case fromManaged.TOGGLE_DHCP:
    case fromAddressing.SET_IP:
    case fromAddressing.SET_NETMASK:
    case fromAddressing.SET_GATEWAY:
    case fromSaved.SAVE_START:
    case fromSaved.SAVE_COMPLETED:
    case fromFieldError.SET_ERROR:
        return { ...state, [action.lampId]: singleLamp(state[action.lampId], action) };
    default:
        return state;
    }
};

export default lamps;

// channels
export const getStripCurrentColor = (state, stripNumber) => fromConfig.getStripCurrentColor(state.config, stripNumber);
export const getStripIsEnabled = (state, stripNumber) => fromConfig.getStripIsEnabled(state.config, stripNumber);
export const getChannelsCount = state => fromConfig.getChannelsCount(state.config);

// daylight
export const getDayColor = state => fromConfig.getDayColor(state.config);
export const getDayColorIntensity = state => fromConfig.getDayColorIntensity(state.config);

// timings
export const getSunriseTime = state => fromConfig.getSunriseTime(state.config);
export const getSunsetTime = state => fromConfig.getSunsetTime(state.config);

// twilight
export const getTwilightValue = state => fromConfig.getTwilightValue(state.config);

// night
export const getNightColor = state => fromConfig.getNightColor(state.config);
export const getNightColorIntensity = state => fromConfig.getNightColorIntensity(state.config);

// temperature
export const getFanStartTemperature = state => fromConfig.getFanStartTemperature(state.config);

// fan
export const getFanMaxSpeed = state => fromConfig.getFanMaxSpeed(state.config);

// caps
export const isChannelMappingAvailable = state => fromCaps.isChannelMappingAvailable(state.caps);
export const isFanConfigAvailable = state => fromCaps.isFanConfigAvailable(state.caps);
export const isTemperatureConfigAvailable = state => fromCaps.isTemperatureConfigAvailable(state.caps);

// wifi
export const getMode = state => fromWifi.getMode(state.wifi);
export const getSsid = state => fromWifi.getSsid(state.wifi);
export const getPassword = state => fromWifi.getPassword(state.wifi);
export const isDhcpEnabled = state => fromWifi.isDhcpEnabled(state.wifi);
export const getIp = state => fromWifi.getIp(state.wifi);
export const getNetmask = state => fromWifi.getNetmask(state.wifi);
export const getGateway = state => fromWifi.getGateway(state.wifi);

// saved
export const isConfigSaved = state => fromSaved.isConfigSaved(state.saved);
export const isLampConfigSaved = state => fromSaved.isLampConfigSaved(state.saved);
export const isWifiConfigSaved = state => fromSaved.isWifiConfigSaved(state.saved);
