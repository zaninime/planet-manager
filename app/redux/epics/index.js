import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { startLoadingEpic, completeLoadingEpic } from 'app/redux/epics/loading';
import startSavingEpic from 'app/redux/epics/saving';
import demoEpic from 'app/redux/epics/demo';

// epic
const rootEpic = combineEpics(
    startLoadingEpic,
    completeLoadingEpic,
    startSavingEpic,
    demoEpic,
);

export default createEpicMiddleware(rootEpic);
