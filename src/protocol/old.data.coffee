logPrefixC = (c) -> c.constructor.name

isInt = (value) -> not isNaN(value) and ((x) -> (x | 0) == x;)(parseFloat(value))

pad = (n, width, z) ->
  z = z || '0'
  n = n + ''
  if n.length >= width then n else new Array(width - n.length + 1).join(z) + n;

class StatusResponse
  constructor: () ->

  @parseString: (str) ->
    re = /^(016)(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})(\d{4})(\d{4})/
    match = str.match re
    if match is null
       return status: "error",
        message: "Response doesn't match the required format",
        component: "StatusResponse.parseString"
    status = new StatusResponse()
    status.colors =
      white: parseInt match[2]
      red: parseInt match[3]
      green: parseInt match[4]
      blue: parseInt match[5]
    status.fanSpeed = parseInt match[6]
    status.temperature = (parseInt match[7])/10
    status.linkQuality = parseInt match[8]
    status.serial = match[9]
    status.firmwareVersion = match[10]
    status: "success"
    value: status


class StatusUpdate
  constructor: (@_white = 0, @_red = 0, @_green = 0, @_blue = 0) ->
  Object.defineProperties @prototype,
    white:
      get: -> @_white
      set: (intensity) ->
        if not isInt(intensity) or intensity < 0 or intensity > 100 then throw "#{logPrefixC @}: white percentage intensity out of range"
        @_white = parseInt intensity
        return
    red:
      get: -> @_red
      set: (intensity) ->
        if not isInt(intensity) or intensity < 0 or intensity > 100 then throw "#{logPrefixC @}: red percentage intensity out of range"
        @_red = parseInt intensity
        return
    green:
      get: -> @_green
      set: (intensity) ->
        if not isInt(intensity) or intensity < 0 or intensity > 100 then throw "#{logPrefixC @}: green percentage intensity out of range"
        @_green = parseInt intensity
        return
    blue:
      get: -> @_blue
      set: (intensity) ->
        if not isInt(intensity) or intensity < 0 or intensity > 100 then throw "#{logPrefixC @}: blue percentage intensity out of range"
        @_blue = parseInt intensity
        return
  socketify: () ->
    str = pad @white, 3
    str += pad @red, 3
    str += pad @green, 3
    str += pad @blue, 3


class ColorConfig
  constructor: () ->
    @_delay = 0
    @_duration = 0
    @_slope = 0
    @_intensity = 0
  Object.defineProperties @prototype,
    delay:
      get: -> @_delay
      set: (delay) ->
        if not isInt(delay) or delay < 0 then throw "#{logPrefixC @}: invalid negative delay"
        @_delay = parseInt delay
        return
    duration:
      get: -> @_duration
      set: (duration) ->
        if not isInt(duration) or duration < 0 then throw "#{logPrefixC @}: invalid negative duration"
        @_duration = parseInt duration
        return
    slope:
      get: -> @_slope
      set: (slope) ->
        if not isInt(slope) or slope < 0 or slope > 99 then throw "#{logPrefixC @}: invalid slope value"
        @_slope = parseInt slope
        return
    intensity:
      get: -> @_intensity
      set: (intensity) ->
        if not isInt(intensity) or intensity < 0 or intensity > 100 then throw "#{logPrefixC @}: invalid intensity value"
        @_intensity = parseInt intensity
        return
  socketify: ->
    delayH = parseInt (parseInt @_delay) / 60
    delayM = (parseInt @_delay) % 60
    durationH = parseInt (parseInt @_duration) / 60
    durationM = (parseInt @_duration) % 60
    str = (pad delayH, 2)[0..1]
    str += (pad delayM, 2)[0..1]
    str += (pad durationH, 2)[0..1]
    str += (pad durationM, 2)[0..1]
    str += ('0' for x in [0...8]).join("")
    str += pad (parseInt @_slope), 2
  @parseString: (s) ->
    re = /^(\d{2})(\d{2})(\d{2})(\d{2})\d{8}(\d{2})$/
    match = s.match re
    if not match? then return status: "error", message: "Input doesn't match the required format", component: "ColorConfig.parseString"
    delay = (parseInt match[1]) * 60 + (parseInt match[2])
    duration = (parseInt match[3]) * 60 + (parseInt match[4])
    slope = (parseInt match[5])
    cc = new ColorConfig()
    [cc.delay, cc.duration, cc.slope] = [delay, duration, slope]
    status: "success"
    value: cc

class TSettings
  constructor: (@_temp = 0, @_speed = 0) ->
  Object.defineProperties @.prototype,
    temp:
      get: -> @_temp
      set: (t) ->
        if not isInt(t) or t < 0 then throw "#{logPrefixC @}: invalid negative value"
        @_temp = parseInt t
        return
    speed:
      get: -> @_speed
      set: (s) ->
        if not isInt(s) or s < 0 or s > 100 then throw "#{logPrefixC @}: invalid speed value"
        @_speed = parseInt s
        return

class FanConfig

  constructor: () ->
    @_start = new TSettings()
    @_max = new TSettings()
    @_ramp = 0
  Object.defineProperties @.prototype,
    start:
      get: -> @_start
    max:
      get: -> @_max
    ramp:
      get: -> @_ramp
      set: (r) ->
        if not isInt(r) or r < 0 or r > 100 then throw "#{logPrefixC @}: invalid ramp value"
        @_ramp = parseInt r
        return
  socketify: ->
    str = (pad @start._temp, 3)[0..2]
    str += (pad @start._speed, 3)[0..2]
    str += (pad @ramp, 3)[0..2]
    str += (pad @max._speed, 3)[0..2]
    str += (pad @max._temp, 3)[0..2]
    str
  @parseString: (str) ->
    re = /^(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})$/
    m = str.match re
    if not m? then return status: "error", message: "Input doesn't match the required format", component: "FanConfig.parseString"
    fc = new FanConfig()
    fc.start.temp = parseInt m[1]
    fc.start.speed = parseInt m[2]
    fc.ramp = parseInt m[3]
    fc.max.speed = parseInt m[4]
    fc.max.temp = parseInt m[5]
    status: "success"
    value: fc


class NightConfig
  constructor: () ->
    @_color = 1
    @_intensity = 0
  Object.defineProperties @.prototype,
    color:
      get: ->
        switch @_color
          when 1 then 'white'
          when 2 then 'red'
          when 3 then 'green'
          when 4 then 'blue'
      set: (c) ->
        @_color = switch c
          when 'white' then 1
          when 'red' then 2
          when 'green' then 3
          when 'blue' then 4
          else throw "#{logPrefixC @}: invalid color"
        return
    intensity:
      get: -> @_intensity
      set: (i) ->
        if not isInt(i) or i < 0 or i > 100 then throw "#{logPrefixC @}: intensity out of range"
        @_intensity = parseInt i
  socketify: ->
    str = @_color.toString()[0..1]
    str += (pad @_intensity, 3)[0..2]
    str
  @parseString: (str) ->
    color = switch parseInt str[0]
      when 1 then 'white'
      when 2 then 'red'
      when 3 then 'green'
      when 0, 4 then 'blue'
      else 'invalid'
    if color is 'invalid' then return status: "error", message: "Invalid color number ##{str[0]}", component: "NightConfig.parseString"
    intensity = parseInt str[1..]
    if isNaN intensity then return status: "error", message: "Can't parse #{str[1..]} as int", component: "NightConfig.parseString"
    nc = new NightConfig()
    [nc.color, nc.intensity] = [color, intensity]
    status: "success"
    value: nc


class CMap
  constructor: () ->
    @_map = ((x%4)+1 for x in [0...12])
  list: () -> @_map[..]
  set: (v) ->
    for ch, color of v
      setSingle ch, color
    return
  setSingle: (ch, color) ->
    if !isInt(ch) or ch < 1 or ch > 12 then return status: "error", message: "Invalid strip position \"#{ch}\"", component: "#{logPrefixC @}::setSingle"
    value = switch color
      when "off" then 0
      when "white" then 1
      when "red" then 2
      when "green" then 3
      when "blue" then 4
      else -1
    if value == -1 then return status: "error", message: "Invalid color name \"#{color}\"", component: "#{logPrefixC @}::setSingle"
    @_map[ch] = value
    status: "success"
  @parseString: (s) ->
    v = (parseInt x for x in s.split(""))
    cm = new CMap()
    if v.length != 12 then return status: "error", message: "Invalid length", component: "CMap.parseString"
    for x, i in v
      if not (0 <= x < 5) then return status: "error", message: "Invalid color ##{x} @ position #{i}", component: "CMap.parseString"
      cm._map[i] = x
    status: "success"
    value: cm
  socketify: ->
    @_map.join("")


class Config
  constructor: () ->
    @_colors = {
      white: new ColorConfig(),
      red: new ColorConfig(),
      green: new ColorConfig(),
      blue: new ColorConfig()
    }
    @_channelMapping = new CMap()
    @_fan = new FanConfig()
    @_night = new NightConfig()
    @_mode = 0x31
  Object.defineProperties @prototype,
    colors:
      get: ->
        c = @_colors
        {white: c.white, red: c.red, green: c.green, blue: c.blue}
    channelMapping:
      get: -> @_channelMapping
    fan:
      get: -> @_fan
    night:
      get: -> @_night
    mode:
      get: ->
        switch @_mode
          when 0x31 then return 'master'
          when 0x30 then return 'slave'
        return ''
      set: (str) ->
        switch str
          when 'master' then @_mode = 0x31
          when 'slave' then @_mode = 0x30
          else throw "#{logPrefixC @}: invalid mode value"
        return
  socketify: () ->
    str = @_colors.white.socketify()
    str += @_colors.red.socketify()
    str += @_colors.green.socketify()
    str += @_colors.blue.socketify()
    str += @_channelMapping.socketify()
    str += @_fan.socketify()
    str += @_night.socketify()
    str += (pad @_colors.white.intensity, 3)[0..2]
    str += (pad @_colors.red.intensity, 3)[0..2]
    str += (pad @_colors.green.intensity, 3)[0..2]
    str += (pad @_colors.blue.intensity, 3)[0..2]
    str += String.fromCharCode @_mode
  @parseString: (str) ->
    c = new Config()
    cl = c._colors
    colorData = (ColorConfig.parseString str[x..x+17] for x in [0..54] by 18)
    colorNames = ["white", "red", "green", "blue"]
    for color, i in colorData
      if color.status isnt "success" then return color
      cl[colorNames[i]] = color.value
    if (cmap = CMap.parseString str[72..83]).status isnt "success" then return cmap
    c._channelMapping = cmap.value
    if (fan = FanConfig.parseString str[84..98]).status isnt "success" then return fan
    c._fan = fan.value
    if (night = NightConfig.parseString str[99..102]).status isnt "success" then return night
    c._night = night.value
    [cl.white.intensity, cl.red.intensity, cl.green.intensity, cl.blue.intensity] = [
      (parseInt str[103..105]),
      (parseInt str[106..108]),
      (parseInt str[109..111]),
      (parseInt str[112..114])
    ]
    if ([cl.white.intensity, cl.red.intensity, cl.green.intensity, cl.blue.intensity].reduce (t, s) -> t or isNaN(s)) == 1
      return status: "error", message: "Cannot parse color intensities: #{[str[103..105], str[106..108], str[109..111], str[112..114]]}", component: "Config.parseString"
    mode = switch parseInt str[115]
      when 1 then 'master'
      when 0 then 'slave'
      else 'invalid'
    if mode is "invalid" then return status: "error", message: "Cannot parse mode: #{str[115]}, expected 0 or 1", component: "Config.parseString"
    c.mode = mode
    status: "success"
    value: c
  @fromNFC: (data) ->
    c = new Config()
    for color in ['white', 'red', 'green', 'blue']
      for k, v of data[color]
        c.colors[color][k] = v
    c._fan =
      _start:
        _temp: data.fan.start.temp
        _speed: data.fan.start.speed
      _max:
        _temp: data.fan.max.temp
        _speed: data.fan.max.speed
      _ramp: data.fan.ramp
    c._fan._start.__proto__ = TSettings.prototype
    c._fan._max.__proto__ = TSettings.prototype
    c._fan.__proto__ = FanConfig.prototype
    c._night.color = data.night.color
    c._night.intensity = data.night.intensity
    c._channelMapping._map = data.channelMapping
    c
  _toNFC: () ->
    obj =
      channelMapping: @channelMapping.list()
      fan:
        start:
          temp: @fan.start.temp
          speed: @fan.start.speed
        max:
          temp: @fan.max.temp
          speed: @fan.max.speed
        ramp: @fan.ramp
      night:
        color: @night.color
        intensity: @night.intensity
    for color in ['white', 'red', 'green', 'blue']
      obj[color] = {}
      for prop in ['delay', 'duration', 'slope', 'intensity']
        obj[color][prop] = @colors[color][prop]
    obj


inet4Addr2Array = (str) ->
  parts = str.split(".")
  if parts.length != 4 then throw "inet4Addr2Array: invalid number of parts"
  for part in parts
    if not isInt part then throw "inet4Addr2Array: #{part} is not an integer"
    n = parseInt part
    if not (0 <= n < 256) then throw "inet4Addr2Array: invalid unsigned byte content #{n}"
  parts.map (n) -> parseInt n


class WiFiConfig
  constructor: () ->
    @_ssid = ""
    @_password = ""
    @_address = [0, 0, 0, 0]
    @_netmask = [255, 255, 255, 255]
    @_gateway = [0, 0, 0, 0]
    @_port = 0
    @dhcpEnabled = true
    @_channel = 0
    @_isWiFiMaster = true

  Object.defineProperties @prototype,
    ssid:
      get: () -> @_ssid
      set: (str) -> @_ssid = str[0..31]; return
    password:
      get: () -> @_password
      set: (str) -> @_password = str[0..31]; return
    address:
      get: () -> @_address.join "."
      set: (str) -> @_address = inet4Addr2Array str; return
    netmask:
      get: () -> @_netmask.join "."
      set: (str) -> @_netmask = inet4Addr2Array str; return
    gateway:
      get: () -> @_gateway.join "."
      set: (str) -> @_gateway = inet4Addr2Array str; return
    port:
      get: () -> @_port
      set: (num) ->
        port = parseInt num
        if not (0 < port < 65536) then throw "#{logPrefixC @}: invalid port ##{port}"
        @_port = port
        return
    channel:
      get: () ->
        if @_channel == 0 then return "auto"
        return @_channel
      set: (num) ->
        if num == "auto" then @_channel = 0; return
        ch = parseInt num
        if not (0 < ch < 14) then throw "#{logPrefixC @}: invalid channel ##{ch}"
        @_channel = ch
        return
    mode:
      get: () ->
        if @_isWiFiMaster then return "master"
        return "station"
      set: (mode) ->
        if mode == "master"
          @_isWiFiMaster = true
          return
        if mode == "station"
          @_isWiFiMaster = false
          return
        throw "#{logPrefixC @}: invalid mode '#{mode}'"
  socketify: () ->
    formatIP = (ip) ->
      p = ip.map (p) -> pad p, 3
      p.join("")

    str = formatIP @_address
    str += @_ssid.replace(' ', '$')
    str += ('\x00' for _ in [0...32-@_ssid.length]).join ""
    str += @_password
    str += ('\x00' for _ in [0...32-@_password.length]).join ""
    str += pad @_port, 5
    str += "5500"
    str += formatIP @_gateway
    str += "192168000123"
    str += formatIP @_netmask
    str += "2"
    if @dhcpEnabled
      if @_isWiFiMaster then str += "4"
      else str += "1"
    else
      str += "0"
    str += "00"
    if @_isWiFiMaster then str += "0"
    else str += "1"
    str += pad @_channel, 2
  @parseString: (str) ->
    wc = new WiFiConfig()
    data = str.split ","
    if data.length != 9
      return {
        status: "error"
        message: "Invalid data format"
      }
    wc.ssid = data[0].replace('$', ' ')
    wc.password = data[1]
    wc.address = data[2]
    wc.port = parseInt data[3]
    wc.dhcpEnabled = (parseInt data[4]) == 1 or (parseInt data[4]) == 4
    channel = parseInt data[5]
    if channel == 0 then wc.channel = "auto"
    else wc.channel = channel
    wc.gateway = data[6]
    wc.netmask = data[7]
    if (parseInt data[8]) == 1
      wc.mode = "station"
    else if (parseInt data[8]) == 0
      wc.mode = "master"
    status: "success"
    value: wc


module.exports = {
  StatusResponse
  StatusUpdate
  Config
  WiFiConfig
}
