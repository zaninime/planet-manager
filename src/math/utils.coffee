hsv2rgb = (h, s, v) ->
  h = h %% (2 * Math.PI)
  c = v * s
  h = h * 3 / Math.PI
 # h = h*6
  x = c * (1 - Math.abs h % 2 - 1)
  [r, g, b] = 
    if h < 1
      [c, x, 0]
    else if h < 2
      [x, c, 0]
    else if h < 3
      [0, c, x]
    else if h < 4
      [0, x, c]
    else if h < 5
      [x, 0, c]
    else
      [c, 0, x]
  m = v - c
  [r + m, g + m, b + m].map (v) -> v.toFixed 5


rgb2hsv = (r, g, b) ->
  v = Math.max r, g, b
  x = v - Math.min r, g, b
  [
    ( if x is 0
        0
      else if v is r
        (g - b) / x
      else if v is g
      	(b - r) / x + 2
      else
      	(r - g) / x + 4
    ) %% 6 / 3 * Math.PI
    if v is 0
    	0
    else
       x / v
    v
  ]


isInt = (value) -> not isNaN(value) and ((x) -> (x | 0) == x;)(parseFloat(value))

pad = (n, width, z) ->
	z = z || '0'
	n = n + ''
	if n.length >= width then n else new Array(width - n.length + 1).join(z) + n;


getMsSinceMidnight = (d) ->
  e = new Date(d);
  d - e.setHours(0,0,0,0)


module.exports = {
	hsv2rgb
	rgb2hsv
	isInt
	pad
  getMsSinceMidnight
}