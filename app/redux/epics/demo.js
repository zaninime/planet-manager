import Rx from 'rxjs/Rx';
import { applyTempColor } from 'app/protocol/api';
import { getDayColor, getDayColorIntensity } from 'app/redux/modules';
import { emitDemo } from 'app/protocol/photon/emitter';

const DEMO_MODE = 'lamps/DEMO_MODE';

const demoEpic = (action$, store) =>
    action$.ofType(DEMO_MODE)
        .map(({ payload: { lampId } }) => ({
            lampId,
            color: getDayColor(store.getState(), lampId),
            intensity: getDayColorIntensity(store.getState(), lampId),
        }))
        .map(({ lampId, color, intensity }) => ({ lampId, ...emitDemo(color, intensity) }))
        .throttleTime(1000)
        .mergeMap(({ white, red, green, blue, lampId }) =>
            Rx.Observable.from(applyTempColor(lampId, { white, red, green, blue })),
        )
        .mergeMap(() => Rx.Observable.empty());

export default demoEpic;
