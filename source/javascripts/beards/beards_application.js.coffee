window.Beards =

  ROWS: 25
  COLS: 80

  MAX_FRAMESKIP: 10
  FPS: 30
  SKIP_TICKS: 1000 / 30

  MOVE_SPEED_MS: 50

  egoX: 10
  egoY: 4 

  deltaX: 0
  deltaY: 0

  loaded: false
  dirty: true

  # Loads a room via URL
  loadRoom: (url) ->
    script = document.createElement("script")
    script.type = "text/javascript"
    script.src = url
    $('body').append(script)

  start: ->
    @nextTick = (new Date).getTime()
    @nextMove = @nextTick
    @renderer = new Beards.Renderer($('#terminal').get(0))
    @renderer.load =>
      level = @loadRoom("http://beard2/levels/start.js")

    # Render loop
    setInterval @tick.bind(this), 1000/60

    $(document).keydown (event) => @keyDown(event.keyCode)
    $(document).keyup (event) => @keyUp(event.keyCode)

  keyDown: (keyCode) ->
    switch keyCode
      when 37 then @deltaX = -1
      when 38 then @deltaY = -1
      when 39 then @deltaX = 1
      when 40 then @deltaY = 1

  keyUp: (keyCode) ->
    switch keyCode
      when 37 then @deltaX = 0
      when 38 then @deltaY = 0
      when 39 then @deltaX = 0
      when 40 then @deltaY = 0

  update: (now) ->

    if (@deltaX or @deltaY) and (now > @nextMove)

      @dirty = true
      @egoX += @deltaX
      @egoY += @deltaY

      @egoX = 0 if @egoX < 0
      @egoY = 0 if @egoY < 0
      @egoX = @COLS - 1 if @egoX >= @COLS
      @egoY = @ROWS - 1 if @egoY >= @ROWS      

      $('#yPos').text(@egoY)
      $('#xPos').text(@egoX)

      if @triggers and callback = @triggers["#{@egoX},#{@egoY}"]
        callback()

      @nextMove = (new Date).getTime() + @MOVE_SPEED_MS

  tick: ->


    loops = 0   
    now = (new Date).getTime()
    while (now > @nextTick and loops < @MAX_FRAMESKIP)    
      @update(now)
      @nextTick += @SKIP_TICKS
      loops++
      now = (new Date).getTime()

    if @loaded and @dirty
      @renderer.refresh()
      @renderer.drawChar(2, @egoX, @egoY)
      @dirty = false

  mapChanged: () ->
    @renderer.clearMap()
    @map.each (row, j) =>
      row.each (col, i) =>
        symbol = @legend[col]
        @renderer.drawMap(symbol.code, i, j) if symbol    

  startRoom: (level) ->

    @triggers = null
    @map = []
    level.map.each (row) => @map.push(row.split(''))            
    @loaded = true
    @legend = level.legend
    @triggers = level.triggers
    @egoX = level.start[0]
    @egoY = level.start[1]

    @mapChanged()

$(document).ready (e) ->  
  Beards.start()
