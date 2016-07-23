Utils = require './utils.coffee'
TopConfig = require './config.jsx'
_ = require 'underscore'

MAX_RADIUS = 90
COLORS = ['red', 'green', 'blue']


condense = (d) ->
    [k, v] = [[], []]
    for k1, v1 of d
        k.push k1
        v.push v1
    k.sort (a, b) -> d[a] - d[b]
    v.sort()
    r = []
    v.reduce (p, x, i) ->
        last = p[p.length-1]
        lastR = r[r.length-1]
        if last is undefined or x != last[0]
            p.push [x]
            r.push [k[i]]
        else if x == last[0]
            last.push x
            lastR.push k[i]
        p
    , []
    r


always3 = (a) ->
    if a.length == 2 then return [a[0], [], a[1]]
    else if a.length == 3 then return a
    else return null


cardinality = (v) -> v.map (x) -> x.length


sunriseTime = (config) ->
    Math.min.apply null, (config.colors[x].delay for x in COLORS)


sunsetTime = (config) ->
    Math.max.apply null, (config.colors[x].delay + 2 * config.colors[x].slope + config.colors[x].duration for x in COLORS)


dayLightBeginTime = (config) ->
    Math.round ((config.colors[x].delay + config.colors[x].slope for x in COLORS).reduce (p, x) -> p + x) / 3


twilightDuration = (config) ->
    (dayLightBeginTime config) - (sunriseTime config)


whiteDelay = (config) ->
    dur =  twilightDuration config
    res = config.colors.white.delay - (sunriseTime config)
    if res < 0 then return 0
    if res >= dur then return dur-1
    res


twilightRadius = (config) ->
    st = sunriseTime config
    res = Math.max.apply null, (config.colors[x].delay - st for x in COLORS)
    if st + res > dayLightBeginTime config or res > MAX_RADIUS then return null
    res


twilightPhase = (config) ->
    rad = twilightRadius config
    if rad is null then return null
    steps = (twilightRadius config) * 6
    if rad == 0 then return null
    colors = {}
    st = sunriseTime config
    for color in COLORS
        colors[color] = config.colors[color].delay - st
    c = always3 condense colors
    exceptionStr = "InvalidState: ERROR"
    if 'red' in c[0]
        if 'green' in c[0]
            if 'blue' in c[2] then return 2 * rad
        else if 'green' in c[1]
            if 'blue' in c[2] then return 2 * rad - colors['green']
        else if 'green' in c[2]
            if 'blue' in c[0] then return 0
            else if 'blue' in c[1] then return colors['blue']
            else if 'blue' in c[2] then return rad
    else if 'red' in c[1]
        if 'green' in c[0]
            if 'blue' in c[2] then return 2 * rad + colors['red']
        else if 'green' in c[2]
            if 'blue' in c[0] then return 6 * rad - colors['red']
    else if 'red' in c[2]
        if 'green' in c[0]
            if 'blue' in c[0] then return 4 * rad
            else if 'blue' in c[1] then return 4 * rad - colors['blue']
            else if 'blue' in c[2] then return 3 * rad
        else if 'green' in c[1]
            if 'blue' in c[0] then return 4 * rad + colors['green']
        else if 'green' in c[2]
            if 'blue' in c[0] then return 5 * rad
    throw exceptionStr


convertAll = (config) ->
    top = new TopConfig.default()
    top.mode = config.mode
    top.time =
        sunrise: sunriseTime config
        sunset: sunsetTime config
    top.twilight.phase = twilightPhase config
    top.twilight.radius = twilightRadius config
    if top.twilight.radius is null then return null
    top.twilight.duration = twilightDuration config
    top.twilight.whiteDelay = whiteDelay config
    top.dayColor.white = config.colors.white.intensity / 100
    hsv = Utils.rgb2hsv config.colors.red.intensity / 100, config.colors.green.intensity / 100, config.colors.blue.intensity / 100
    if hsv is null then return null
    [top.dayColor.h, top.dayColor.s, top.dayColor.v] = hsv
    top.night = {
        color: config.night.color,
        intensity: config.night.intensity / 100
    }
    if top.night.intensity > .3 then top.night.intensity = .3
    top.fan =
        start:
            speed: config.fan.start.speed
            temp: config.fan.start.temp
        max:
            speed: config.fan.max.speed
            temp: config.fan.max.temp
        ramp: config.fan.ramp

    applyChannelMapping top, config
    top


applyChannelMapping = (top, config) ->
    top.channelMapping = _.clone(config._channelMapping._map)


module.exports = {
    sunriseTime
    sunsetTime
    dayLightBeginTime
    twilightRadius
    twilightPhase
    whiteDelay
    convertAll
    applyChannelMapping
}
