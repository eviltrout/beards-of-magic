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
