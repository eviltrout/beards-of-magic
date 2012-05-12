window.Beards = Ember.Application.create

  inventoryBinding: "Beards.Inventory"

  ROWS: 25
  COLS: 80

  MAX_FRAMESKIP: 10
  FPS: 30
  SKIP_TICKS: 1000 / 30

  MOVE_SPEED_MS: 50

  PLAYER_CODE: '0'
  EMPTY_CELL: ' '

  flags: Array()
  paused: false

  modalQueue: Array()

  # When the character moves
  moved: (->

    egoX = @ego.get('x')
    egoY = @ego.get('y')

    @set('standingOn', '')
    if egoX and egoY and @legend
      code = @map[egoY][egoX]
      if cell = @legend[code]

        # If we can pick it up
        if cell.pickup_as
          @replaceTile(@EMPTY_CELL, egoX, egoY)
          @get('inventory').addItem Beards.Item.create
            name: cell.name
            id: cell.pickup_as          
        else
          @set('standingOn', cell.name)

  ).observes('ego.x', 'ego.y')

  # Loads a room via URL
  loadRoom: (url, x=null, y=null) ->
    @loaded = false
    @dirty = true
    @deltaX = 0
    @deltaY = 0

    @roomUrl = url

    # Where to start the player after we load
    @postLoadX = x
    @postLoadY = y

    script = document.createElement("script")
    script.type = "text/javascript"
    script.src = url
    $('body').append(script)

  start: ->
    @set 'ego', Beards.Actor.create
      code: @PLAYER_CODE

    @nextTick = (new Date).getTime()
    @nextMove = @nextTick
    @renderer = new Beards.Renderer($('#terminal').get(0))
    @renderer.load =>
      if window.location.hash
        hash = window.location.hash.replace("#", "")
        level = @loadRoom("http://beard2/levels/#{hash}")
      else
        level = @loadRoom("http://beard2/levels/start.js")
    @renderer.addActor(@ego)

    @sidebar = Beards.Sidebar.create()
    @sidebar.appendTo('#sidebar')

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
      else return true
    false
    
  keyUp: (keyCode) ->
    switch keyCode
      when 37, 39 then @deltaX = 0
      when 38, 40 then @deltaY = 0
      when 32, 13
        @paused = false
        @dirty = true
      else return true
    false

  solid: (x, y) ->

    return true if x < 0 or x >= @COLS
    return true if y < 0 or y >= @ROWS

    destCell = @map[y][x]
    if cell = @legend[destCell]
      return true if cell.solid
    false

  update: (now) ->

    return if @paused

    if (@deltaX or @deltaY) and (now > @nextMove)

      @dirty = true

      destX = @ego.get('x') + @deltaX
      destY = @ego.get('y') + @deltaY

      if @solid(destX, destY)
        unless @solid(destX, @ego.get('y'))
          @ego.set('x', destX)
        else if not @solid(@ego.get('x'), destY)
          @ego.set('y', destY)
      else
        @ego.set('x', destX)
        @ego.set('y', destY)

      triggerId = "#{destX},#{destY}"
      if @triggers and callback = @triggers[triggerId]
        callback(destX, destY)

      @nextMove = (new Date).getTime() + @MOVE_SPEED_MS

  tick: ->

    return if @paused

    if @modalQueue.length
      @paused = true
      @deltaX = @deltaY = 0
      @renderer.modal(@modalQueue.shift())


    loops = 0   
    now = (new Date).getTime()
    while (now > @nextTick and loops < @MAX_FRAMESKIP)    
      @update(now)
      @nextTick += @SKIP_TICKS
      loops++
      now = (new Date).getTime()

    if @loaded and @dirty and (not @paused)
      @renderer.refresh()
      #@renderer.drawCode(@PLAYER_CODE, @get('egoX'), @get('egoY'))
      @dirty = false

  mapChanged: () ->
    @renderer.clearMap()
    @map.each (row, j) =>
      row.each (col, i) =>
        @renderer.drawMap(col, i, j)

  # Returns true if an inventory item was used
  useItem: (itemId) ->
    @inventory.useItem(itemId)

  # Set a flag by name
  setRoomFlag: (flag, value) -> 
    @flags[SHA1("#{@roomUrl}#{flag}")] = value

  # Get a flag by name 
  getRoomFlag: (flag) -> 
    @flags[SHA1("#{@roomUrl}#{flag}")] 

  # API for replacing a tile on the map with another
  replaceTile: (c, x, y) ->
    @map[y][x] = c
    @mapChanged()

  modal: (message) ->
    @modalQueue.push(message)

  modalOnce: (message) ->
    unless @getRoomFlag(message)
      @modal(message)
      @setRoomFlag(message, true)

  teleport: (x, y) ->
    @ego.set('x', x)
    @ego.set('y', y)

  startRoom: (level) ->
    @triggers = null
    @map = []
    @set('description', level.description)
    level.map.each (row) => @map.push(row.split(''))
    @renderer.importLegend(level.legend)
    @renderer.setTile(@PLAYER_CODE, 0x02, "bright_white", "black")
    @triggers = level.triggers

    @triggers["55,18"] = => @loadRoom("http://beard2/levels/minefield.js")

    if @postLoadX isnt null
      level.start[0] = @postLoadX
      @postLoadX = null

    if @postLoadY isnt null
      level.start[1] = @postLoadY
      @postLoadY = null

    @ego.set('x', level.start[0])
    @ego.set('y', level.start[1])
    level.enterRoom() if level.enterRoom

    @solids = Array()
    @legend = level.legend
    @mapChanged()
    @loaded = true

$(document).ready (e) ->  
  Beards.start()
