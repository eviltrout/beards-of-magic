window.Beards =

  ROWS: 25
  COLS: 80

  egoX: 10
  egoY: 4  
  loaded: false
  dirty: true

  SYMBOLS: 
    '#': 178

  # Loads a room via URL
  loadRoom: (url) ->
    script = document.createElement("script")
    script.type = "text/javascript"
    script.src = url
    $('body').append(script)

  start: ->
    @renderer = new Beards.Renderer($('#terminal').get(0))
    @renderer.load =>
      level = @loadRoom("http://beard2/levels/start.js")

    # Render loop
    setInterval @tick.bind(this), 1000/60

    $(document).bind 'keydown', 'up', => @move(0, -1)
    $(document).bind 'keydown', 'down', => @move(0, 1)
    $(document).bind 'keydown', 'left', => @move(-1, 0)
    $(document).bind 'keydown', 'right', => @move(1, 0)

  move: (offX, offY) ->
    @egoX += offX
    @egoY += offY

    @egoX = 0 if @egoX < 0
    @egoY = 0 if @egoY < 0
    @egoX = @COLS - 1 if @egoX >= @COLS
    @egoY = @ROWS - 1 if @egoY >= @ROWS

    @dirty = true

  tick: ->

    if @loaded and @dirty
      @renderer.clear()

      @map.each (row, j) =>
        row.each (col, i) =>
          symbol = @SYMBOLS[col]
          @renderer.drawChar(symbol, i, j) if symbol

      @renderer.drawChar(1, @egoX, @egoY)
      @dirty = false

  startRoom: (level) ->

    @map = []
    level.map.each (row) => @map.push(row.split(''))            
    @loaded = true
    

$(document).ready (e) ->  
  Beards.start()
