Config = require './config.jsx'
Utils = require './utils.coffee'
und = require 'underscore'
data = require '../protocol/data.coffee';

convertAll = (config) ->
  bottom = new data.Config()
  delay = config.time.sunrise
  twilightDuration = config.twilight.duration
  dayDuration = config.time.sunset - config.time.sunrise - 2 * twilightDuration
  rad = config.twilight.radius
  phase = config.twilight.phase
  c = bottom.colors
  [c.red.duration, c.green.duration, c.blue.duration, c.white.duration] = (dayDuration for _ in [0..3])
  c.white.delay = delay + config.twilight.whiteDelay
  c.white.slope = twilightDuration - config.twilight.whiteDelay
  rgb = Utils.hsv2rgb(config.dayColor.h, config.dayColor.s, config.dayColor.v)
  [c.red.intensity, c.green.intensity, c.blue.intensity] = rgb.map (e) -> Math.round e * 100
  c.white.intensity = Math.round config.dayColor.white * 100
  if 0 <= phase < rad
    c.red.delay = delay
    c.green.delay = delay + rad
    c.blue.delay = delay + phase
    c.red.slope = twilightDuration
    c.green.slope = twilightDuration - rad
    c.blue.slope = twilightDuration - phase
  else if rad <= phase < 2 * rad
    c.red.delay = delay
    c.green.delay = delay - phase + 2 * rad
    c.blue.delay = delay + rad
    c.red.slope = twilightDuration
    c.green.slope = twilightDuration + phase - 2 * rad
    c.blue.slope = twilightDuration - rad
  else if 2 * rad <= phase < 3 * rad
    c.red.delay = delay + phase - 2 * rad
    c.green.delay = delay
    c.blue.delay = delay + rad
    c.red.slope = twilightDuration - phase + 2 * rad
    c.green.slope = twilightDuration
    c.blue.slope = twilightDuration - rad
  else if 3 * rad <= phase < 4 * rad
    c.red.delay = delay + rad
    c.green.delay = delay
    c.blue.delay = delay - phase + 4 * rad
    c.red.slope = twilightDuration - rad
    c.green.slope = twilightDuration
    c.blue.slope = twilightDuration + phase - 4 * rad
  else if 4 * rad <= phase < 5 * rad
    c.red.delay = delay + rad
    c.green.delay = delay + phase - 4 * rad
    c.blue.delay = delay
    c.red.slope = twilightDuration - rad
    c.green.slope = twilightDuration - phase + 4 * rad
    c.blue.slope = twilightDuration
  else if 5 * rad <= phase < 6 * rad
    c.red.delay = delay - phase + 6 * rad
    c.green.delay = delay + rad
    c.blue.delay = delay
    c.red.slope = twilightDuration + phase - 6 * rad
    c.green.slope = twilightDuration - rad
    c.blue.slope = twilightDuration
  else
    [c.red.delay, c.green.delay, c.blue.delay, c.white.delay] = (delay for _ in [0..3])
    [c.red.slope, c.green.slope, c.blue.slope, c.white.slope] = (twilightDuration for _ in [0..3])
  [bottom.night.color, bottom.night.intensity] = [config.night.color, config.night.intensity * 100]
  [bottom.fan.start.speed, bottom.fan.start.temp] = [config.fan.start.speed, config.fan.start.temp]
  [bottom.fan.max.speed, bottom.fan.max.temp] = [config.fan.max.speed, config.fan.max.temp]
  bottom.fan.ramp = config.fan.ramp
  bottom.channelMapping._map = und.clone(config.channelMapping)
  bottom.mode = config.mode
  bottom


applyFan = (oldConf, newConf) ->
  oldStart = oldConf.fan.start
  oldMax = oldConf.fan.max
  newStart = newConf.fan.start
  newMax = newConf.fan.max
  [newStart.speed, newStart.temp] = [oldStart.speed, oldStart.temp]
  [newMax.speed, newMax.temp] = [oldMax.speed, oldMax.temp]
  newConf.fan.ramp = oldConf.fan.ramp
  newConf._fan = oldConf._fan
  return


applyChannelMapping = (oldConf, newConf) ->
  for c, i in oldConf.channelMapping.list()
    newConf.channelMapping.setSingle(i+1, c)
  return


module.exports = {
  convertAll
  applyFan
  applyChannelMapping
}
