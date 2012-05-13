Beards.startRoom({
  description: "Loneliness",
  start: [15, 11],
  legend: {
    "D": {code: 0xB2, fg: "bright_green",   bg: "black",    solid: true,  name: "Fog"},
    "C": {code: 0xB1, fg: "bright_green",   bg: "black",    solid: true,  name: "Fog"},
    "B": {code: 0xB0, fg: "bright_green",   bg: "black",    solid: true,  name: "Fog"},
    "A": {code: 0xB2, fg: "green",   bg: "black",    solid: true,  name: "Fog"},    
    "p": {code: 0xB3, fg: "bright_yellow", bg: "blue", solid: false, name: "Portal"},
    "P": {code: 0xC4, fg: "bright_white", bg: "red", solid: false, name: "Portal"}
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
        "         CCC    AAA                                       ACDDDDCCCBA      ",
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
  
  triggers: {},

  portals: [
    ["42,15", "21,14", "You hear it again."],
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
      Beards.loadRoom("http://beard2/levels/start.js")
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
    this.createPortal()

    //this.portal = {from: "43,15", to: "21,14", newPos: "47,9" }
    //this.createPortal("42,15", "21,14")
    Beards.modalOnce("You hear a sound in the distance.")
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