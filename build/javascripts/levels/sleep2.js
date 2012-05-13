Beards.startRoom({
  description: "Emptiness",
  start: [61, 14],
  legend: {
    "B": {code: 0xB2, fg: "bright_blue", bg: "black", solid: true, name: "Fog"},
    "A": {code: 0xB1, fg: "bright_blue", bg: "black", solid: true, name: "Fog"},    
    "p": {code: 0xB3, fg: "bright_yellow", bg: "blue", name: "Portal"},
    "P": {code: 0xC4, fg: "bright_white", bg: "red", name: "Portal"},
    "+": {code: 0x08, fg: "bright_green", bg: "black", solid: true, name: "Small door"},
    "k": {code: 0x1B, fg: "bright_green", bg: "black", name: "Small key",  pickup_as: "small_key"},
  },
  map: [
        "                                                                            ",
        "                                                                            ",
        "                                                                            ",
        "               ABBA                                                         ",
        "         ABBBBBBBBBBBA                                                      ",
        "        ABBBBBBBBBBBBBBBBA            ABBBBBBBBBBBBBBBA                     ",
        "       ABBBBA   ABBBBBBBBBBBBA      ABBBBBBBBBBBBBBBBBBBBBBA                ",
        "       BBBBA     ABBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBA               ",
        "       BBBA        BA    ABBBBBBBBBBBBBBBA             ABBBBBBBBBA          ",
        "       BBBBBBBBB+BBA        ABBBBBBBBBA                   ABBBBBBBA         ",
        "       ABBBBBB                                              ABBBBBA         ",
        "        BBBBBB                              ABBBBBBBBBA      ABBBBBA        ",
        "      ABBBBBBB                            ABBBBBBBBBBBBA       ABBBBA       ",
        "     ABBBBBBBA                          ABBBBBBBBBBBBBBBA        BBBB       ",
        "     BBBBA                            ABBBBBBA       BBBB        BBBB       ",
        "     BBBB                            ABBBBBBA        ABBBBA     ABBBA       ",
        "     BBBBBBBBBBBBBA                ABBBBBA            BBBBBBBBBBBBBB        ",
        "     ABBBBBBBBBBBBBBBBBA          ABBBBBA             ABBBBBBBBBBBBA        ",
        "       ABBBBBBBBBBBBBBBBBBA  ABBBBBBBBBA                ABBBBBBBBA          ",
        "                 ABBBBBBBBBBBBBBBBBBBA                                      ",
        "                      ABBBBBBBBBBBBBA                                       ",
        "                         ABBBBA                                             ",
        "                                                                            ",
        "                                                                            ",
        "                                                                            "
       ],

  triggers: {
    "14,7": function() {
      Beards.loadRoom("http://lost-arts.ca/javascripts/levels/sleep3.js")
    },

    "16,9": function() {
      if (!Beards.getRoomFlag('seen_door')) {
        Beards.modalOnce("A locked door blocks your path.");
        Beards.setRoomFlag('seen_door', true);        

        setTimeout(function () {
          Beards.modalOnce("<Clink!>")
          Beards.modalOnce("What was that?")
          Beards.replaceTile('k', 26, 16);

          this.triggers["26,16"] = function() {
            Beards.modalOnce("You found a small key!");
          }  

        }.bind(this), 2000)        
      } else {
        if (Beards.useItem('small_key')) {
          Beards.replaceTile(' ', 16,9)
        }
      }
      
    }
  },

  enterRoom: function() {
    Beards.modalOnce("What is this place?");
  },

  update: function(elapsed) {    
    if ((elapsed % 400) < 200) {
      Beards.replaceTile('P', 14, 7, false);
    } else {
      Beards.replaceTile('p', 14, 7, false);
    }
  },

});
