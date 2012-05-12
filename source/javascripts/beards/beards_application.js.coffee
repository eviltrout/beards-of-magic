window.Beards =

  ROWS: 25
  COLS: 80

  MAX_FRAMESKIP: 10
  FPS: 30
  SKIP_TICKS: 1000 / 30

  MOVE_SPEED_MS: 50

  PLAYER_CODE: '0'

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
      else
        return true
    false
    

  keyUp: (keyCode) ->
    switch keyCode
      when 37 then @deltaX = 0
      when 38 then @deltaY = 0
      when 39 then @deltaX = 0
      when 40 then @deltaY = 0
      else 
        return true
    false

  solid: (x, y) ->
    destCell = @map[y][x]
    if cell = @legend[destCell]
      return true if cell.solid
    false

  update: (now) ->

    if (@deltaX or @deltaY) and (now > @nextMove)

      @dirty = true

      destX = @egoX + @deltaX
      destY = @egoY + @deltaY
      destX = 0 if destX < 0
      destY = 0 if destY < 0
      destX = @COLS - 1 if destX >= @COLS
      destY = @ROWS - 1 if destY >= @ROWS      

      if @solid(destX, destY)
        unless @solid(destX, @egoY)
          @egoX = destX
        else if not @solid(@egoX, destY)
          @egoY = destY
      else
        @egoX = destX
        @egoY = destY

      $('#yPos').text(@egoY)
      $('#xPos').text(@egoX)

      #if @triggers and callback = @triggers["#{@egoX},#{@egoY}"]
      #  callback()

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
      @renderer.drawChar(@PLAYER_CODE, @egoX, @egoY)
      @dirty = false

  mapChanged: () ->
    @renderer.clearMap()
    @map.each (row, j) =>
      row.each (col, i) =>
        @renderer.drawMap(col, i, j)

  startRoom: (level) ->

    @triggers = null
    @map = []
    level.map.each (row) => @map.push(row.split(''))
    @renderer.importLegend(level.legend)
    @renderer.setTile(@PLAYER_CODE, 0x02, "bright_white", "black")
    @triggers = level.triggers
    @egoX = level.start[0]
    @egoY = level.start[1]
    @solids = Array()
    @legend = level.legend
    @mapChanged()
    @loaded = true

$(document).ready (e) ->  
  Beards.start()
