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

    @characters = Array()
    for c in [0..255]
      cy = Math.floor(c / 16)
      cx = (c - (cy * 16))
      @characters[c] = [cx * @CHAR_WIDTH, cy * @CHAR_HEIGHT]

    @ctx = @canvas.getContext('2d')

  load: (finished) ->
    @fontImage = new Image()
    @fontImage.src = "/images/font.png"
    @fontImage.onload = => finished()

  drawMap: (c, x, y) ->
    pos = @characters[c]  
    @mapCtx.drawImage(@fontImage, pos[0], pos[1], @CHAR_WIDTH, @CHAR_HEIGHT, x*@CHAR_WIDTH, y*@CHAR_HEIGHT, @CHAR_WIDTH, @CHAR_HEIGHT)

  drawChar: (c, x, y) ->
    pos = @characters[c]
    @ctx.drawImage(@fontImage, pos[0], pos[1], @CHAR_WIDTH, @CHAR_HEIGHT, x*@CHAR_WIDTH, y*@CHAR_HEIGHT, @CHAR_WIDTH, @CHAR_HEIGHT)

  refresh: ->
    @ctx.drawImage(@mapCanvas, 0, 0)

  clearMap: ->
    @mapCtx.fillStyle = '#000'
    @mapCtx.fillRect(0,0, @CANVAS_WIDTH, @CANVAS_HEIGHT)
  

