import { goBack } from 'react-router-redux';
import { Observable } from 'rxjs/Observable';
import { wifiToProtocolFormat } from 'app/protocol/photon/wifi';
import emit from 'app/protocol/photon/emitter';
import {
  saveConfig as apiSaveConfig,
  saveClock,
  saveWifiConfig,
} from 'app/protocol/api';

import { setError } from 'app/redux/modules/error';
import { isWifiConfigSaved } from 'app/redux/modules/lamps';
import { SAVE_START, setConfigSaved } from 'app/redux/modules/saved';

const startSavingEpic = (action$, store) =>
  action$.ofType(SAVE_START)
    .mergeMap(action =>
      Observable.of(action).map(() => {
          const state = store.getState().lamps[action.payload.lampId];
          return {
              clock: new Date(),
              emittedConfig: emit(state.config, state.caps.features, state.caps.bugs),
              wifi: !isWifiConfigSaved(state) ? wifiToProtocolFormat(state.wifi) : undefined,
          };
      })
      .mergeMap(data =>
        Observable.from([
            Observable.of(data).mergeMap(({ clock }) => saveClock(action.payload.lampId, clock)).delay(1000),
            Observable.of(data).mergeMap(({ emittedConfig }) => apiSaveConfig(action.payload.lampId, emittedConfig)),
            data.wifi ?
            Observable.of(data).delay(1000).mergeMap(({ wifi }) => saveWifiConfig(action.payload.lampId, wifi)) :
            Observable.of(true),
        ]),
      )
      .concatAll()
      .toArray()
      .mergeMap(x => [
          ...[setConfigSaved(action.payload.lampId)],
          x[2] ? undefined : goBack(),
      ])
      .filter(x => x !== undefined)
      .catch((error) => Observable.of(setError(error))),
    );

export default startSavingEpic;
