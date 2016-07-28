/*
To be implemented:

* load config
* set timing
* set twilight (?)
* set day color
* set night color
* test day color (?)
* test night color (?)
* set temp ctl
* toggle strip color
* toggle wifi mode
* set wifi ap params
* set wifi managed params
*/

export const setTimerStart = (time) => ({type: 'CONFIG_SET_TIMER_START', time});
export const setTimerEnd = (time) => ({type: 'CONFIG_SET_TIMER_END', time});

export const nextStripColor = (idx) => ({type: 'CONFIG_NEXT_STRIP_COLOR', idx});
export const enableStrip = (idx) => ({type: 'CONFIG_TOGGLE_STRIP_ENABLE', idx});
export const disableStrip = (idx) => ({type: 'CONFIG_TOGGLE_STRIP_DISABLE', idx});
