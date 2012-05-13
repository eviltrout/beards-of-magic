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
(function() {

  window.Beards.Actor = Ember.Object.extend({
    hidden: false
  });

}).call(this);
(function() {

  window.Beards.Inventory = Ember.Object.create({
    items: [],
    itemTypes: {},
    itemCount: (function() {
      return this.get('items').length;
    }).property('items.@each'),
    itemsGrouped: (function() {
      var counts, itemTypes,
        _this = this;
      counts = {};
      this.get('items').each(function(i) {
        counts[i.id] = (counts[i.id] || 0) + 1;
        return true;
      });
      itemTypes = this.get("itemTypes");
      return Object.keys(counts).map(function(key) {
        return "" + counts[key] + " x " + (itemTypes[key].get('name'));
      });
    }).property('items.@each'),
    hasItem: function(itemId) {
      var item, _i, _len, _ref;
      _ref = this.get('items');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.id === itemId) return true;
      }
      return false;
    },
    useItem: function(itemId) {
      var index, item, items, _i, _len;
      items = this.get('items');
      index = 0;
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if (item.id === itemId) {
          items.removeAt(index);
          return true;
        }
        index++;
      }
      return false;
    },
    addItem: function(item) {
      this.get('itemTypes')[item.id] = item;
      return this.get('items').pushObject(item);
    }
  });

}).call(this);
(function() {

  window.Beards.Item = Ember.Object.extend({
    dummy: function() {
      return false;
    }
  });

}).call(this);
(function() {

  window.Beards.Renderer = (function() {

    Renderer.prototype.CANVAS_WIDTH = 640;

    Renderer.prototype.CANVAS_HEIGHT = 400;

    Renderer.prototype.CHAR_WIDTH = 8;

    Renderer.prototype.CHAR_HEIGHT = 15;

    Renderer.prototype.COLOURS = {
      "black": {
        index: 0
      },
      "red": {
        index: 1,
        hex: '#A00'
      },
      "green": {
        index: 2,
        hex: '#0A0'
      },
      "yellow": {
        index: 3,
        hex: '#A50'
      },
      "blue": {
        index: 4,
        hex: '#00A'
      },
      "magenta": {
        index: 5,
        hex: '#A0A'
      },
      "cyan": {
        index: 6,
        hex: '#0AA'
      },
      "white": {
        index: 7,
        hex: '#AAA'
      },
      "bright_black": {
        index: 8,
        hex: '#555'
      },
      "bright_red": {
        index: 9,
        hex: '#F55'
      },
      "bright_green": {
        index: 10,
        hex: '#5F5'
      },
      "bright_yellow": {
        index: 11,
        hex: '#FF5'
      },
      "bright_blue": {
        index: 12,
        hex: '#55F'
      },
      "bright_magenta": {
        index: 13,
        hex: '#F5F'
      },
      "bright_cyan": {
        index: 14,
        hex: '#5FF'
      },
      "bright_white": {
        index: 15,
        hex: '#FFF'
      }
    };

    Renderer.prototype.actors = [];

    function Renderer(canvas) {
      this.canvas = canvas;
      this.mapCanvas = document.createElement('canvas');
      this.mapCanvas.width = this.canvas.width;
      this.mapCanvas.height = this.canvas.height;
      this.mapCtx = this.mapCanvas.getContext('2d');
      this.fonts = Array();
      this.ctx = this.canvas.getContext('2d');
    }

    Renderer.prototype.addActor = function(actor) {
      return this.actors.push(actor);
    };

    Renderer.prototype.loadFont = function(num, finished) {
      var _this = this;
      if (num < 0) return finished();
      this.fonts[num] = new Image();
      this.fonts[num].src = "/images/color" + num + ".gif";
      return this.fonts[num].onload = function() {
        return _this.loadFont(num - 1, finished);
      };
    };

    Renderer.prototype.load = function(finished) {
      return this.loadFont(15, finished);
    };

    Renderer.prototype.setTile = function(key, code, fg, bg) {
      var cx, cy;
      cy = Math.floor(code / 16);
      cx = code - (cy * 16);
      return this.legend[key] = {
        x: cx * this.CHAR_WIDTH,
        y: cy * this.CHAR_HEIGHT,
        bgColour: this.COLOURS[bg].hex,
        font: this.fonts[this.COLOURS[fg].index]
      };
    };

    Renderer.prototype.importLegend = function(legend) {
      var _this = this;
      this.legend = Array();
      return Object.each(legend, function(key) {
        var entry;
        entry = legend[key];
        return _this.setTile(key, entry.code, entry.fg, entry.bg);
      });
    };

    Renderer.prototype.drawCell = function(ctx, c, x, y) {
      var entry, sx, sy;
      if (entry = this.legend[c]) {
        sx = x * this.CHAR_WIDTH;
        sy = y * this.CHAR_HEIGHT;
        if (entry.bgColour) {
          ctx.fillStyle = entry.bgColour;
          ctx.fillRect(sx, sy, this.CHAR_WIDTH, this.CHAR_HEIGHT);
        }
        return ctx.drawImage(entry.font, entry.x, entry.y, this.CHAR_WIDTH, this.CHAR_HEIGHT, sx, sy, this.CHAR_WIDTH, this.CHAR_HEIGHT);
      }
    };

    Renderer.prototype.drawMap = function(c, x, y) {
      return this.drawCell(this.mapCtx, c, x, y);
    };

    Renderer.prototype.drawCode = function(c, x, y) {
      return this.drawCell(this.ctx, c, x, y);
    };

    Renderer.prototype.drawChar = function(c, x, y) {
      var cx, cy, sx, sy;
      cy = Math.floor(c / 16);
      cx = c - (cy * 16);
      sx = x * this.CHAR_WIDTH;
      sy = y * this.CHAR_HEIGHT;
      return this.ctx.drawImage(this.fonts[15], cx * this.CHAR_WIDTH, cy * this.CHAR_HEIGHT, this.CHAR_WIDTH, this.CHAR_HEIGHT, sx, sy, this.CHAR_WIDTH, this.CHAR_HEIGHT);
    };

    Renderer.prototype.modal = function(message) {
      var borderX, borderX2, borderY, borderY2, hPad, i, j, line, lines, maxWidth, posX, posY, vPad, word, _i, _len, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _results;
      this.refresh();
      maxWidth = Beards.COLS - 10;
      lines = [];
      if (message.length > maxWidth) {
        line = "";
        _ref = message.split(" ");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          word = _ref[_i];
          if (line.length + word.length > maxWidth) {
            lines.push(line.trim());
            line = "";
          }
          line += word + " ";
        }
        if (line.length) lines.push(line.trim());
      } else {
        maxWidth = message.length;
        lines.push(message);
      }
      posX = Math.floor((Beards.COLS / 2) - (maxWidth / 2));
      posY = Math.floor((Beards.ROWS / 2) - (lines.length / 2));
      vPad = 2;
      hPad = 3;
      borderX = posX - hPad;
      borderX2 = borderX + maxWidth + hPad + hPad - 1;
      borderY = posY - vPad;
      borderY2 = borderY + lines.length + vPad + vPad - 1;
      this.ctx.fillStyle = this.COLOURS["blue"].hex;
      this.ctx.fillRect(borderX * this.CHAR_WIDTH, borderY * this.CHAR_HEIGHT, (maxWidth + hPad + hPad) * this.CHAR_WIDTH, this.CHAR_HEIGHT * (lines.length + vPad + vPad));
      this.drawChar(201, borderX, borderY);
      this.drawChar(187, borderX2, borderY);
      this.drawChar(188, borderX2, borderY2);
      this.drawChar(200, borderX, borderY2);
      for (i = _ref2 = borderX + 1, _ref3 = borderX2 - 1; _ref2 <= _ref3 ? i <= _ref3 : i >= _ref3; _ref2 <= _ref3 ? i++ : i--) {
        this.drawChar(205, i, borderY);
        this.drawChar(205, i, borderY2);
      }
      for (i = _ref4 = borderY + 1, _ref5 = borderY2 - 1; _ref4 <= _ref5 ? i <= _ref5 : i >= _ref5; _ref4 <= _ref5 ? i++ : i--) {
        this.drawChar(186, borderX, i);
        this.drawChar(186, borderX2, i);
      }
      _results = [];
      for (i = 0, _ref6 = lines.length - 1; 0 <= _ref6 ? i <= _ref6 : i >= _ref6; 0 <= _ref6 ? i++ : i--) {
        line = lines[i];
        _results.push((function() {
          var _ref7, _results2;
          _results2 = [];
          for (j = 0, _ref7 = line.length - 1; 0 <= _ref7 ? j <= _ref7 : j >= _ref7; 0 <= _ref7 ? j++ : j--) {
            _results2.push(this.drawChar(line.charCodeAt(j), posX + j, posY + i));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    Renderer.prototype.refresh = function() {
      var a, _i, _len, _ref, _results;
      this.ctx.drawImage(this.mapCanvas, 0, 0);
      _ref = this.actors;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        if (!a.get('hidden')) {
          _results.push(this.drawCode(a.get('code'), a.get('x'), a.get('y')));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Renderer.prototype.clearMap = function() {
      this.mapCtx.fillStyle = '#000';
      return this.mapCtx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    };

    return Renderer;

  })();

}).call(this);
(function() {

  window.Beards.Sidebar = Ember.View.extend({
    templateName: 'beards_templates_sidebar',
    inventoryBinding: 'Beards.Inventory',
    mute: function() {
      Beards.set('mute', true);
      return false;
    },
    unmute: function() {
      Beards.set('mute', false);
      return false;
    }
  });

}).call(this);
