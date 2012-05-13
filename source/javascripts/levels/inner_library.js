require(["http://lost-arts.ca/javascripts/levels/level_helper.js"], function () {
  var innerLibrary = {
    description: "Inside the Library",
    start: [38, 24],
    legend: {
      "#": {code: 0xB1, fg: "blue", bg: "white", solid: true, name: "Building"},
      "O": {code: 0x07, fg: "white", bg: "black", solid: true, name: "Boulder"},
      "k": {code: 0x1B, fg: "bright_green",   bg: "black",    solid: false, name: "Small key",  pickup_as: "small_key"},
      "+": {code: 0x08, fg: "bright_green",   bg: "black",    solid: true,  name: "Small door"},    
      "$": {code: 0x0A, fg: "red",     bg: "black",    solid: false, name: "Old Book", pickup_as: "old_book"},
      "&": {code: 0x0A, fg: "bright_red",        bg: "black",    solid: false, name: "Old Book", pickup_as: "old_book"},    
      "p": {code: 0xB3, fg: "bright_yellow", bg: "blue", name: "Portal"},
      "P": {code: 0xC4, fg: "bright_white", bg: "red", name: "Portal"},
    },

  map: [
          "                                                                                ",
          "    ########################################################################    ",
          "    #                                                                      #    ",
          "    # #######################+##################################### ###### #    ",
          "    # #                     # #                                   # #k   # #    ",
          "    # # ################### #+#  ################################ # #### # #    ",
          "    # # #k                # # #  #                              # # #    # #    ",
          "    # # ################# # #k#  ###################### ######### # # #### #    ",
          "    #k#                   # #k#  #                    #           # #      #    ",
          "    ####################### #k#  #                    #############+########    ",
          "    #                         #  #          $         #                    #    ",
          "    # #########################  #                    # ################## #    ",
          "    # # #    #                   #                    # #                # #    ",
          "    # # # #####################  #################### # # ############## # #    ",
          "    # # #                                           # # # #           k# # #    ",
          "    # # #  ######################################## # # # # ############ # #    ",
          "    # #    #                                        # # # #              # #    ",
          "    # ############################################### # # ################ #    ",
          "    #    ++++                                         # #                  #    ",
          "    ###################################################+####################    ",
          "    #k                                 +                     k             #    ",
          "    ################################## #####################################    ",
          "                                     # #                                        ",
          "                                     # #                                        ",
          "                                     # #                                        "
         ],

    triggers: {
      "38,25": function(x,y) { Beards.loadRoom("http://lost-arts.ca/javascripts/levels/library.js", 62, 10) },
      "39,20": function(x,y) { LevelHelper.unlockDoor('small_key', x,y) },
      "55,19": function(x,y) { LevelHelper.unlockDoor('small_key', x,y) },
      "67,9": function(x,y) { LevelHelper.unlockDoor('small_key', x,y) },
      "29,3": function(x,y) { LevelHelper.unlockDoor('small_key', x,y) },
      "29,5": function(x,y) { LevelHelper.unlockDoor('small_key', x,y) },
      "9,18": function(x,y) { LevelHelper.unlockDoor('small_key', x,y) },
      "10,18": function(x,y) { LevelHelper.unlockDoor('small_key', x,y) },
      "11,18": function(x,y) { LevelHelper.unlockDoor('small_key', x,y) },
      "12,18": function(x,y) { LevelHelper.unlockDoor('small_key', x,y) },

      "44,10": function(x,y) {
        Beards.modalOnce("You found the old book!");

        this.triggers["51,9"] = function() {
          Beards.loadRoom("http://lost-arts.ca/javascripts/levels/crossroads.js", 38, 21)
        }
      }
    },

    update: function(elapsed) {
      if (!Beards.hasItem('old_book')) {
        if ((elapsed % 400) < 200) {
          Beards.replaceTile('&', 44, 10, false)
        } else {
          Beards.replaceTile('$', 44, 10, false)
        }
      } else {
        if ((elapsed % 400) < 200) {
          Beards.replaceTile('P', 51, 9, false)
        } else {
          Beards.replaceTile('p', 51, 9, false)
        }        
      }
    }

  }         
  LevelHelper.removeDoors('+', innerLibrary);
  Beards.startRoom(innerLibrary);
});
