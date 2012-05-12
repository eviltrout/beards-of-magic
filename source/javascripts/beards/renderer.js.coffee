class window.Beards.Renderer

  CANVAS_WIDTH: 640
  CANVAS_HEIGHT: 400

  CHAR_WIDTH: 8
  CHAR_HEIGHT: 15

  constructor: (@canvas) ->
    @mapCanvas = document.createElement('canvas')
    @mapCanvas.width = @canvas.width
    @mapCanvas.height = @canvas.height
    @mapCtx = @mapCanvas.getContext('2d')

    @fonts = Array()
    @characters = Array()
    for c in [0..255]
      cy = Math.floor(c / 16)
      cx = (c - (cy * 16))
      @characters[c] = [cx * @CHAR_WIDTH, cy * @CHAR_HEIGHT]

    @ctx = @canvas.getContext('2d')

  loadFont: (num, finished) ->
    return finished() if num < 0
    @fonts[num] = new Image()
    @fonts[num].src = "/images/color#{num}.gif"
    @fonts[num].onload = => @loadFont(num-1, finished)

  load: (finished) ->
    @loadFont(15, finished)

  drawMap: (c, x, y) ->
    font = @fonts[10]
    pos = @characters[c]  
    @mapCtx.drawImage(font, pos[0], pos[1], @CHAR_WIDTH, @CHAR_HEIGHT, x*@CHAR_WIDTH, y*@CHAR_HEIGHT, @CHAR_WIDTH, @CHAR_HEIGHT)

  drawChar: (c, x, y) ->
    font = @fonts[15]
    pos = @characters[c]
    @ctx.drawImage(font, pos[0], pos[1], @CHAR_WIDTH, @CHAR_HEIGHT, x*@CHAR_WIDTH, y*@CHAR_HEIGHT, @CHAR_WIDTH, @CHAR_HEIGHT)

  refresh: ->
    @ctx.drawImage(@mapCanvas, 0, 0)

  clearMap: ->
    @mapCtx.fillStyle = '#000'
    @mapCtx.fillRect(0,0, @CANVAS_WIDTH, @CANVAS_HEIGHT)
  

