class window.Beards.Renderer

  CANVAS_WIDTH: 640
  CANVAS_HEIGHT: 400

  CHAR_WIDTH: 8
  CHAR_HEIGHT: 15

  COLOURS:
    "black": {index: 0}
    "red": {index: 1, hex: '#A00'}
    "green": {index: 2, hex: '#0A0'}
    "yellow": {index: 3, hex: '#A50'}
    "blue": {index: 4, hex: '#00A'}    
    "magenta": {index: 5, hex: '#A0A'}
    "cyan": {index: 6, hex: '#0AA'}
    "white": {index: 7, hex: '#AAA'}
    "bright_black": {index: 8, hex: '#555'}
    "bright_red": {index: 9, hex: '#F55'}
    "bright_green": {index: 10, hex: '#5F5'}    
    "bright_yellow": {index: 11, hex: '#FF5'}
    "bright_blue": {index: 12, hex: '#55F'}
    "bright_magenta": {index: 13, hex: '#F5F'}
    "bright_cyan": {index: 14, hex: '#5FF'}
    "bright_white": {index: 15, hex: '#FFF'}

  constructor: (@canvas) ->
    @mapCanvas = document.createElement('canvas')
    @mapCanvas.width = @canvas.width
    @mapCanvas.height = @canvas.height
    @mapCtx = @mapCanvas.getContext('2d')
    @fonts = Array()
    @ctx = @canvas.getContext('2d')

  loadFont: (num, finished) ->
    return finished() if num < 0
    @fonts[num] = new Image()
    @fonts[num].src = "/images/color#{num}.gif"
    @fonts[num].onload = => @loadFont(num-1, finished)

  load: (finished) ->
    @loadFont(15, finished)

  setTile: (key, code, fg, bg) ->
    cy = Math.floor(code / 16)
    cx = (code - (cy * 16))
    @legend[key] = 
      x: cx * @CHAR_WIDTH
      y: cy * @CHAR_HEIGHT
      bgColour: @COLOURS[bg].hex
      font: @fonts[@COLOURS[fg].index]

  importLegend: (legend) ->
    @legend = Array()
    Object.each legend, (key) => 
      entry = legend[key]
      @setTile(key, entry.code, entry.fg, entry.bg)
  
  drawCell: (ctx, c, x, y) ->
    if entry = @legend[c]
      sx = x*@CHAR_WIDTH
      sy = y*@CHAR_HEIGHT
      if entry.bgColour
        ctx.fillStyle = entry.bgColour
        ctx.fillRect(sx,sy,@CHAR_WIDTH,@CHAR_HEIGHT)
      ctx.drawImage(entry.font, entry.x, entry.y, @CHAR_WIDTH, @CHAR_HEIGHT, sx, sy, @CHAR_WIDTH, @CHAR_HEIGHT)

  drawMap: (c, x, y) -> @drawCell(@mapCtx, c, x, y)

  drawChar: (c, x, y) -> @drawCell(@ctx, c, x, y)

  refresh: ->
    @ctx.drawImage(@mapCanvas, 0, 0)

  clearMap: ->
    @mapCtx.fillStyle = '#000'
    @mapCtx.fillRect(0,0, @CANVAS_WIDTH, @CANVAS_HEIGHT)
  

