Beards.startRoom({
  description: "Timelessness",
  start: [40, 12],
  legend: {
    "D": {code: 0xB2, fg: "bright_red",   bg: "black",    solid: true,  name: "Fog"},
    "C": {code: 0xB1, fg: "bright_red",   bg: "black",    solid: true,  name: "Fog"},
    "B": {code: 0xB0, fg: "bright_red",   bg: "black",    solid: true,  name: "Fog"},
    "A": {code: 0xB2, fg: "red",   bg: "black",    solid: true,  name: "Fog"},    
    "p": {code: 0xB3, fg: "bright_yellow", bg: "blue", solid: false, name: "Portal"},
    "P": {code: 0xC4, fg: "bright_white", bg: "red", solid: false, name: "Portal"}
  },
  map: [
        "                                                                                ",
        "                                                                                ",
        "                         ABCCDDDDCCCBA        ABCCCCCCBA                        ",
        "              ACDDDDDDDCCCCCCCCCCCCCCCCCCCCDDDBA       ABCCCCCCCBA              ",
        "             BDDDDDDDDCCCCCCCCCCCCCCCCCCCCDDDCCCBA ABCCCCCCCCCCCCBA             ",
        "             BDDDDDBA    ABCCCCCCCCBA     ABCCCDDDCCCCCCCCCCCCCCDDCA            ",
        "            ABDDDCA                         ABDDDCCCCBA       ACDDCA            ",
        "             ADDDDB                           ABCCBA           ACDDB            ",
        "             ACDDDB                                            ACDDC            ",
        "            ACDDDBA                                          ABCCDCB            ",
        "            BDDDA                                           ACDDCCBA            ",
        "              BDDDCA                                          BDDCA             ",
        "              BDDDDA                                          BDDCA             ",
        "           BCDDDA                                          ABDDDCCCBA           ",
        "          CDDBA                                            ACDDCCDDDCBA         ",
        "         CCC                                               ABCCCDDDCCCBA        ",
        "         CDDA                                                   ABCCDDDB        ",
        "         BDDCA       ABCCBA                                 ABCCCCCCDDDB        ",
        "         ACDDCCCCCCCCCCCDDDBA         ABCCCCCCCBA         ABDDDCCCCCDDCA        ",
        "          ABCCCCCCCCCCCCDDDDDBA     ABCCCCCCCCDDDCBA      BCDDDCCCCCCBA         ",
        "               ABCCCCCCCBA ABDDDCCCCCCCDDDCCCCCCCDDDDDDCCCCCCDDDBA              ",
        "                       ABCCCCCCCCDDCA      ABCDDDCCCCCCCBA                      ",
        "                         ABCCCCCCBA          ABCCCCCCCBA                        ",
        "                                                                                ",
        "                                                                                "
       ],

  triggers: {},

  update: function(elapsed) {

    if (elapsed > 2000) {
      Beards.modalOnce("Wait! Is it all over?")
    }

    if (elapsed > 4000) {
      Beards.modalOnce("Is this the end of all things?")
    }

    if (elapsed > 6000) {

      this.triggers["57,9"] = function() {
        return Beards.loadRoom("http://lost-arts.ca/javascripts/levels/sleep2.js")
      }

      if ((elapsed % 400) < 200) {
        Beards.replaceTile('P', 57, 9, false)
      } else {
        Beards.replaceTile('p', 57, 9, false)
      }
    }
  },

});



