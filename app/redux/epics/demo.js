import Rx from 'rxjs/Rx';
import { applyTempColor } from 'app/protocol/api';

const DEMO_MODE = 'lamps/DEMO_MODE';

const demoEpic = action$ =>
    action$.ofType(DEMO_MODE)
        .mergeMap(({ payload: { white, red, green, blue, lampId } }) =>
            Rx.Observable.from(applyTempColor(lampId, { white, red, green, blue })),
        )
        .mergeMap(() => Rx.Observable.empty());

export default demoEpic;
