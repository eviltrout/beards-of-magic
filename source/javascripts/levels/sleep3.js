Beards.startRoom({
  description: "Loneliness",
  start: [15, 11],
  legend: {
    "D": {code: 0xB2, fg: "white",   bg: "black",    solid: true,  name: "Fog"},
    "C": {code: 0xB1, fg: "white",   bg: "black",    solid: true,  name: "Fog"},
    "B": {code: 0xB0, fg: "white",   bg: "black",    solid: true,  name: "Fog"},
    "A": {code: 0xB1, fg: "white",   bg: "black",    solid: true,  name: "Fog"},    
    "p": {code: 0xB3, fg: "bright_yellow", bg: "blue", solid: false, name: "Portal"},
    "P": {code: 0xC4, fg: "bright_white", bg: "red", solid: false, name: "Portal"},
    "t": {code: 0xF0, fg: "bright_yellow",  bg: "magenta",  solid: true,  name: "Sign"},
  },
map: [
        "                                                                           ",
        "                                                                           ",
        "                                                                           ",
        "                                                                           ",
        "                                                                           ",
        "                   ABCCCCBA                ABCCCCCBA     ABCCCCCBA         ",
        "                ABCCCCCCCCCBA ABCCCCCCBA ABCCCCCCCCCCBAABDDDCCCDDDBA       ",
        "            ABCCDDDCCCCCCCCCCCDDDCCCCDDDCDDDCCCCCCCCDDDDDDDDCCCDDDDCA      ",
        "           ABCCCDDDBA    ABCCCDDDCCCCDDDDDDCA     ABDDDDDDBA   ABDDDCA     ",
        "         ABCCCCCDCB        ABCCBA    ABDDDCA        ACDDCA       ADDDB     ",
        "         BCDBA                         ABBA          ABBA        ADDDB     ",
        "         CDDA                                             ACDDCCCCDDCA     ",
        "         CCC    AAA                  t                    ACDDDDCCCBA      ",
        "         BCDCCCDDDB                                       ACDDDDDBA        ",
        "         ABCCCCDDDB                            ABBA         ACDCA          ",
        "          ABCCCDDDA     AAA        AAA         BCDCBA      ABCCBA          ",
        "               CDDA  ABCDCB        BCDCBA     ADDDCCCCCCCCCDDDBA           ",
        "               BCCBBCDDDDDC        CDDDDDCCCCCDDDCBCCCCCCCCDDCA            ",
        "               ABBBBCDDDDDDCCCCCCCCDDDDDDCCCCCDDCA ABCCCCCCCBA             ",
        "                  ABCCBAABCCCCCCCCCDCBABCCCCCCCBA                          ",
        "                         ABCCCCCCCCCBA                                     ",
        "                                                                           ",
        "                                                                           ",
        "                                                                           ",
        "                                                                           "
       ],
  
  triggers: {
    "37,12": function() {

      var tabletText = "\"One day, everything will end. Today is not that day.\"";

      if (!Beards.getRoomFlag("read_tablet")) {
        Beards.modalOnce("A stone tablet stands before you. It reads:");
        Beards.modal(tabletText, function() {
          setTimeout(function() {
             Beards.modalOnce("You hear a sound in the distance.");
             this.createPortal(); 
          }.bind(this), 1000);
        });
        Beards.setRoomFlag("read_tablet", true);
      } else {
        Beards.modal(tabletText);
      }
    }
  },

  portals: [
    ["42,14", "21,14", "You hear it again."],
    ["47,9", "22,9", "It's getting louder, but you can't quite make out what it is."],
    ["31,16", "61,9", "You can almost recognize it now..."],
    ["14,11", "55,14", "GONG!"]
  ],

  createPortal: function() {

    portal = this.portals[this.currentPortal]
    if (this.portalX && this.portalY) {
      Beards.replaceTile(' ', this.portalX, this.portalY)
      this.portalX = this.portalY = null      
    }

    if (portal == null) {
      Beards.loadRoom("http://lost-arts.ca/javascripts/levels/start.js")
      return
    }
    from = portal[0]
    to = portal[1]
    message = portal[2]

    var fromSplit = from.split(",");
    this.portalX = parseInt(fromSplit[0]);
    this.portalY = parseInt(fromSplit[1]);
    Beards.replaceTile("p", this.portalX, this.portalY);

    this.triggers[from] = function() {
      var dest = to.split(",")
      Beards.teleport(dest[0], dest[1])
      Beards.modalOnce(message)
      this.createPortal()
    }.bind(this);

    this.currentPortal++
  },

  enterRoom: function() {
    this.portalX = this.portalY = null
    this.currentPortal = 0
    
  },

  update: function(elapsed) {
    if (this.portalX && this.portalY) {
      if ((elapsed % 400) < 200) {
        Beards.replaceTile('P', this.portalX, this.portalY, false)
      } else {
        Beards.replaceTile('p', this.portalX, this.portalY, false)
      }    
    }
  },
  
});