class window.Beards.Renderer

  CANVAS_WIDTH: 640
  CANVAS_HEIGHT: 400

  CHAR_WIDTH: 8
  CHAR_HEIGHT: 15

  constructor: (@canvas) ->
    @ctx = @canvas.getContext('2d')
    @ctx.globalCompositeOperation = 'destination-over'

  load: (finished) ->
    @fontImage = new Image()
    @fontImage.src = "/images/font.png"
    @fontImage.onload = finished

  drawChar: (c, x, y) ->
    cy = Math.floor(c / 16)
    cx = (c - (cy * 16))

    console?.log [cx, cy]

    @ctx.drawImage(@fontImage, cx * @CHAR_WIDTH, cy * @CHAR_HEIGHT, @CHAR_WIDTH, @CHAR_HEIGHT, x*@CHAR_WIDTH, y*@CHAR_HEIGHT, @CHAR_WIDTH, @CHAR_HEIGHT)

  clear: ->
    @ctx.clearRect(0,0,@CANVAS_WIDTH,@CANVAS_HEIGHT)
  

