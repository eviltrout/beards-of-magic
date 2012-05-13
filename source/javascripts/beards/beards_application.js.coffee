window.Beards = Ember.Application.create

  inventoryBinding: "Beards.Inventory"

  ROWS: 25
  COLS: 80

  MAX_FRAMESKIP: 10
  FPS: 30
  SKIP_TICKS: 1000 / 30

  MOVE_SPEED_MS: 50
  MOVE_FIRST_STEP_MS: 125

  PLAYER_CODE: '0'
  EMPTY_CELL: ' '

  flags: Array()
  paused: false

  modalQueue: Array()

  mute: false

  muteChanged: (-> 
    if @get('mute')
      Beards.snd.pause()
    else
      Beards.snd.play()

  ).observes('mute')

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
          @replaceTile(@EMPTY_CELL, egoX, egoY, false)
          @setGlobalFlag(SHA1("picked_up_#{@roomUrl},#{egoX},#{egoY}"), true)
          @addItem(cell.name, cell.pickup_as)
        else
          @set('standingOn', cell.name)

  ).observes('ego.x', 'ego.y')

  hidePlayer: ->
    @ego.set('hidden', true)

  showPlayer: ->
    @ego.set('hidden', false)

  # Pause the game
  pause: (finished=null) ->
    @pauseFinished = finished
    @paused = true
    @deltaX = @deltaY = 0
    @elapsed = (new Date).getTime() - @lastTime

  # Unpause the game
  unpause: ->  
    @paused = false
    @dirty = true
    @lastTime = (new Date).getTime() - @elapsed
    @elapsed = null
    @pauseFinished() if @pauseFinished
    @pauseFinished = null

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

    @set('mute', false)

    if window.HTMLAudioElement
      @snd = new Audio('')
      if @snd.canPlayType('audio/mp3')
        @snd = new Audio("audio/music.mp3")
        @snd.loop = true
        @snd.play()

    @set 'ego', Beards.Actor.create
      code: @PLAYER_CODE

    @nextTick = (new Date).getTime()
    @nextMove = @nextTick
    @renderer = new Beards.Renderer($('#terminal').get(0))
    @renderer.load =>
      if window.location.hash
        hash = window.location.hash.replace("#", "")
        server = "http://beard1/javascripts/levels"
        level = @loadRoom("#{server}/#{hash}")
      else
        level = @loadRoom("http://lost-arts.ca/javascripts/levels/title_screen.js?test")
    @renderer.addActor(@ego)

    @sidebar = Beards.Sidebar.create()
    @sidebar.appendTo('#sidebar')

    # Render loop
    setInterval @tick.bind(this), 1000/60

    $(document).keydown (event) => @keyDown(event.keyCode)
    $(document).keyup (event) => @keyUp(event.keyCode)

  keyDown: (keyCode) ->

    # We set nextMove to be 0 so our first step takes longer
    @nextMove = 0 if (@deltaX == 0) and (@deltaY == 0) 

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
        if @hitEnter
          @hitEnter()
          return false
        else
          @unpause()
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
    return unless @loaded    

    @levelUpdate((new Date).getTime() - @lastTime) if @levelUpdate

    return if @ego.get('hidden')

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
        callback = callback.bind(@level)
        callback(destX, destY)

      if @nextMove == 0
        @nextMove = (new Date).getTime() + @MOVE_FIRST_STEP_MS
      else
        @nextMove = (new Date).getTime() + @MOVE_SPEED_MS      

  tick: ->

    return if @paused
    return unless @loaded

    if @modalQueue.length
      modal = @modalQueue.shift()
      @pause(modal.finished)      
      @renderer.modal(modal.message)

    loops = 0   
    now = (new Date).getTime()
    while (now > @nextTick and loops < @MAX_FRAMESKIP)    
      @update(now)
      @nextTick += @SKIP_TICKS
      loops++
      now = (new Date).getTime()

    if @loaded and @dirty and (not @paused)
      @renderer.refresh()
      @dirty = false

  mapChanged: () ->
    @renderer.clearMap()
    @map.each (row, j) =>
      row.each (col, i) =>
        @renderer.drawMap(col, i, j)

  # Returns true if an inventory item was used
  useItem: (itemId) ->
    @get('inventory').useItem(itemId)

  hasItem: (id) ->
    @get('inventory').hasItem(id)
    
  addItem: (name, id) ->
    @get('inventory').addItem Beards.Item.create
      name: name
      id: id

  # Set a global flag
  setGlobalFlag: (flag, value) ->
    @flags[flag] = value

  # Get a global flag
  getGlobalFlag: (flag) ->
    @flags[flag]

  # Set a flag by name
  setRoomFlag: (flag, value) -> 
    @setGlobalFlag(SHA1("#{@roomUrl}#{flag}"), value)

  # Get a flag by name 
  getRoomFlag: (flag) -> 
    @getGlobalFlag(SHA1("#{@roomUrl}#{flag}"))

  removeTrigger: (x, y) ->
    return unless @triggers
    @triggers["#{x},#{y}"] = null

  # API for replacing a tile on the map with another
  replaceTile: (c, x, y, removeTrigger=true) ->
    unless @map[y][x] == c
      @map[y][x] = c
      @removeTrigger(x,y) if removeTrigger
      @dirty = true
      @mapChanged()

  modal: (message, finished) ->
    @modalQueue.push
      message: message
      finished: if finished then finished.bind(@level) else null

  modalOnce: (message, finished) ->
    unless @getRoomFlag(message)
      @modal(message, finished)
      @setRoomFlag(message, true)

  teleport: (x, y) ->
    @ego.set('x', parseInt(x))
    @ego.set('y', parseInt(y))

  error: (msg) ->
    alert(msg)
    false

  startRoom: (level) ->
    @map = []
    @set('description', level.description)    

    @hitEnter = level.hitEnter

    j = 0
    level.map.each (row) => 
      cells = row.split('')

      # Remove any objects we've already picked up
      i = 0
      for cell in cells
        cell = level.legend[cell]
        if cell and cell.pickup_as
          if @getGlobalFlag(SHA1("picked_up_#{@roomUrl},#{i},#{j}"))
            cells[i] = ' '
        i++
      @map.push(cells)
      j++
    
    @renderer.importLegend(level.legend)    
    @renderer.setTile(@PLAYER_CODE, 0x02, "bright_white", "black")

    @elapsed = 0
    @lastTime = (new Date).getTime()
    if level.update
      @levelUpdate = level.update.bind(level)
    else
      @levelUpdate = null

    @level = level

    @triggers = level.triggers || {}

    if @postLoadX isnt null
      level.start[0] = @postLoadX
      @postLoadX = null

    if @postLoadY isnt null
      level.start[1] = @postLoadY
      @postLoadY = null

    @ego.set('x', level.start[0])
    @ego.set('y', level.start[1])

    level.enterRoom(level.start[0], level.start[1]) if level.enterRoom

    @showPlayer()
    @solids = Array()
    @legend = level.legend
    @loaded = true
    @mapChanged()

    

$(document).ready (e) ->  
  Beards.start()
