import { push } from 'react-router-redux';
import Rx from 'rxjs/Rx';

import { wifiToReducerFormat } from 'app/utils/addressing';
import { collect } from 'app/protocol/photon/collector';
import {
  fetchConfig,
  fetchStatus,
  fetchWifiConfig,
} from 'app/protocol/api';

import { setError } from 'app/redux/modules/error';
import { LOAD_START, LOAD_COMPLETED, completeLoading } from 'app/redux/modules/config';

export const startLoadingEpic = action$ =>
  action$.ofType(LOAD_START)
  .mergeMap(action =>
    Rx.Observable.from([
        Rx.Observable.of(action.payload.lampId).mergeMap(lampId => fetchStatus(lampId)).delay(1000),
        Rx.Observable.of(action.payload.lampId).mergeMap(lampId => fetchConfig(lampId)).delay(1000),
        Rx.Observable.of(action.payload.lampId).mergeMap(lampId => fetchWifiConfig(lampId)),
    ])
    .concatAll()
    .toArray()
    .map(x => completeLoading(action.payload.lampId, collect(x[1], x[0]), wifiToReducerFormat(x[2])))
    .catch(error => Rx.Observable.of(setError(error))),
  );

export const completeLoadingEpic = action$ =>
  action$.ofType(LOAD_COMPLETED)
    .map(action => push(`/${action.payload.lampId}/day/`));
