(function() {

  window.Beards = Ember.Application.create({
    inventoryBinding: "Beards.Inventory",
    ROWS: 25,
    COLS: 80,
    MAX_FRAMESKIP: 10,
    FPS: 30,
    SKIP_TICKS: 1000 / 30,
    MOVE_SPEED_MS: 50,
    MOVE_FIRST_STEP_MS: 125,
    PLAYER_CODE: '0',
    EMPTY_CELL: ' ',
    flags: Array(),
    paused: false,
    modalQueue: Array(),
    mute: false,
    muteChanged: (function() {
      if (this.get('mute')) {
        return Beards.snd.pause();
      } else {
        return Beards.snd.play();
      }
    }).observes('mute'),
    moved: (function() {
      var cell, code, egoX, egoY;
      egoX = this.ego.get('x');
      egoY = this.ego.get('y');
      this.set('standingOn', '');
      if (egoX && egoY && this.legend) {
        code = this.map[egoY][egoX];
        if (cell = this.legend[code]) {
          if (cell.pickup_as) {
            this.replaceTile(this.EMPTY_CELL, egoX, egoY, false);
            this.setGlobalFlag(SHA1("picked_up_" + this.roomUrl + "," + egoX + "," + egoY), true);
            return this.addItem(cell.name, cell.pickup_as);
          } else {
            return this.set('standingOn', cell.name);
          }
        }
      }
    }).observes('ego.x', 'ego.y'),
    hidePlayer: function() {
      return this.ego.set('hidden', true);
    },
    showPlayer: function() {
      return this.ego.set('hidden', false);
    },
    pause: function(finished) {
      if (finished == null) finished = null;
      this.pauseFinished = finished;
      this.paused = true;
      this.deltaX = this.deltaY = 0;
      return this.elapsed = (new Date).getTime() - this.lastTime;
    },
    unpause: function() {
      this.paused = false;
      this.dirty = true;
      this.lastTime = (new Date).getTime() - this.elapsed;
      this.elapsed = null;
      if (this.pauseFinished) this.pauseFinished();
      return this.pauseFinished = null;
    },
    loadRoom: function(url, x, y) {
      var script;
      if (x == null) x = null;
      if (y == null) y = null;
      this.loaded = false;
      this.dirty = true;
      this.deltaX = 0;
      this.deltaY = 0;
      this.roomUrl = url;
      this.postLoadX = x;
      this.postLoadY = y;
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = url;
      return $('body').append(script);
    },
    start: function() {
      var _this = this;
      this.set('mute', false);
      if (window.HTMLAudioElement) {
        this.snd = new Audio('');
        if (this.snd.canPlayType('audio/mp3')) {
          this.snd = new Audio("audio/music.mp3");
          this.snd.loop = true;
          this.snd.play();
        }
      }
      this.set('ego', Beards.Actor.create({
        code: this.PLAYER_CODE
      }));
      this.nextTick = (new Date).getTime();
      this.nextMove = this.nextTick;
      this.renderer = new Beards.Renderer($('#terminal').get(0));
      this.renderer.load(function() {
        var hash, level, server;
        if (window.location.hash) {
          hash = window.location.hash.replace("#", "");
          server = "http://beard1/javascripts/levels";
          return level = _this.loadRoom("" + server + "/" + hash);
        } else {
          return level = _this.loadRoom("http://lost-arts.ca/javascripts/levels/title_screen.js?test");
        }
      });
      this.renderer.addActor(this.ego);
      this.sidebar = Beards.Sidebar.create();
      this.sidebar.appendTo('#sidebar');
      setInterval(this.tick.bind(this), 1000 / 60);
      $(document).keydown(function(event) {
        return _this.keyDown(event.keyCode);
      });
      return $(document).keyup(function(event) {
        return _this.keyUp(event.keyCode);
      });
    },
    keyDown: function(keyCode) {
      if ((this.deltaX === 0) && (this.deltaY === 0)) this.nextMove = 0;
      switch (keyCode) {
        case 37:
          this.deltaX = -1;
          break;
        case 38:
          this.deltaY = -1;
          break;
        case 39:
          this.deltaX = 1;
          break;
        case 40:
          this.deltaY = 1;
          break;
        default:
          return true;
      }
      return false;
    },
    keyUp: function(keyCode) {
      switch (keyCode) {
        case 37:
        case 39:
          this.deltaX = 0;
          break;
        case 38:
        case 40:
          this.deltaY = 0;
          break;
        case 32:
        case 13:
          if (this.hitEnter) {
            this.hitEnter();
            return false;
          } else {
            this.unpause();
          }
          break;
        default:
          return true;
      }
      return false;
    },
    solid: function(x, y) {
      var cell, destCell;
      if (x < 0 || x >= this.COLS) return true;
      if (y < 0 || y >= this.ROWS) return true;
      destCell = this.map[y][x];
      if (cell = this.legend[destCell]) if (cell.solid) return true;
      return false;
    },
    update: function(now) {
      var callback, destX, destY, triggerId;
      if (this.paused) return;
      if (!this.loaded) return;
      if (this.levelUpdate) this.levelUpdate((new Date).getTime() - this.lastTime);
      if (this.ego.get('hidden')) return;
      if ((this.deltaX || this.deltaY) && (now > this.nextMove)) {
        this.dirty = true;
        destX = this.ego.get('x') + this.deltaX;
        destY = this.ego.get('y') + this.deltaY;
        if (this.solid(destX, destY)) {
          if (!this.solid(destX, this.ego.get('y'))) {
            this.ego.set('x', destX);
          } else if (!this.solid(this.ego.get('x'), destY)) {
            this.ego.set('y', destY);
          }
        } else {
          this.ego.set('x', destX);
          this.ego.set('y', destY);
        }
        triggerId = "" + destX + "," + destY;
        if (this.triggers && (callback = this.triggers[triggerId])) {
          callback = callback.bind(this.level);
          callback(destX, destY);
        }
        if (this.nextMove === 0) {
          return this.nextMove = (new Date).getTime() + this.MOVE_FIRST_STEP_MS;
        } else {
          return this.nextMove = (new Date).getTime() + this.MOVE_SPEED_MS;
        }
      }
    },
    tick: function() {
      var loops, modal, now;
      if (this.paused) return;
      if (!this.loaded) return;
      if (this.modalQueue.length) {
        modal = this.modalQueue.shift();
        this.pause(modal.finished);
        this.renderer.modal(modal.message);
      }
      loops = 0;
      now = (new Date).getTime();
      while (now > this.nextTick && loops < this.MAX_FRAMESKIP) {
        this.update(now);
        this.nextTick += this.SKIP_TICKS;
        loops++;
        now = (new Date).getTime();
      }
      if (this.loaded && this.dirty && (!this.paused)) {
        this.renderer.refresh();
        return this.dirty = false;
      }
    },
    mapChanged: function() {
      var _this = this;
      this.renderer.clearMap();
      return this.map.each(function(row, j) {
        return row.each(function(col, i) {
          return _this.renderer.drawMap(col, i, j);
        });
      });
    },
    useItem: function(itemId) {
      return this.get('inventory').useItem(itemId);
    },
    hasItem: function(id) {
      return this.get('inventory').hasItem(id);
    },
    addItem: function(name, id) {
      return this.get('inventory').addItem(Beards.Item.create({
        name: name,
        id: id
      }));
    },
    setGlobalFlag: function(flag, value) {
      return this.flags[flag] = value;
    },
    getGlobalFlag: function(flag) {
      return this.flags[flag];
    },
    setRoomFlag: function(flag, value) {
      return this.setGlobalFlag(SHA1("" + this.roomUrl + flag), value);
    },
    getRoomFlag: function(flag) {
      return this.getGlobalFlag(SHA1("" + this.roomUrl + flag));
    },
    removeTrigger: function(x, y) {
      if (!this.triggers) return;
      return this.triggers["" + x + "," + y] = null;
    },
    replaceTile: function(c, x, y, removeTrigger) {
      if (removeTrigger == null) removeTrigger = true;
      if (this.map[y][x] !== c) {
        this.map[y][x] = c;
        if (removeTrigger) this.removeTrigger(x, y);
        this.dirty = true;
        return this.mapChanged();
      }
    },
    modal: function(message, finished) {
      return this.modalQueue.push({
        message: message,
        finished: finished ? finished.bind(this.level) : null
      });
    },
    modalOnce: function(message, finished) {
      if (!this.getRoomFlag(message)) {
        this.modal(message, finished);
        return this.setRoomFlag(message, true);
      }
    },
    teleport: function(x, y) {
      this.ego.set('x', parseInt(x));
      return this.ego.set('y', parseInt(y));
    },
    error: function(msg) {
      alert(msg);
      return false;
    },
    startRoom: function(level) {
      var j,
        _this = this;
      this.map = [];
      this.set('description', level.description);
      this.hitEnter = level.hitEnter;
      j = 0;
      level.map.each(function(row) {
        var cell, cells, i, _i, _len;
        cells = row.split('');
        i = 0;
        for (_i = 0, _len = cells.length; _i < _len; _i++) {
          cell = cells[_i];
          cell = level.legend[cell];
          if (cell && cell.pickup_as) {
            if (_this.getGlobalFlag(SHA1("picked_up_" + _this.roomUrl + "," + i + "," + j))) {
              cells[i] = ' ';
            }
          }
          i++;
        }
        _this.map.push(cells);
        return j++;
      });
      this.renderer.importLegend(level.legend);
      this.renderer.setTile(this.PLAYER_CODE, 0x02, "bright_white", "black");
      this.elapsed = 0;
      this.lastTime = (new Date).getTime();
      if (level.update) {
        this.levelUpdate = level.update.bind(level);
      } else {
        this.levelUpdate = null;
      }
      this.level = level;
      this.triggers = level.triggers || {};
      if (this.postLoadX !== null) {
        level.start[0] = this.postLoadX;
        this.postLoadX = null;
      }
      if (this.postLoadY !== null) {
        level.start[1] = this.postLoadY;
        this.postLoadY = null;
      }
      this.ego.set('x', level.start[0]);
      this.ego.set('y', level.start[1]);
      if (level.enterRoom) level.enterRoom(level.start[0], level.start[1]);
      this.showPlayer();
      this.solids = Array();
      this.legend = level.legend;
      this.loaded = true;
      return this.mapChanged();
    }
  });

  $(document).ready(function(e) {
    return Beards.start();
  });

}).call(this);
