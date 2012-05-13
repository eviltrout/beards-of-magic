window.LevelHelper = {
	unlockDoor: function(itemId, x, y) {
		var doorKey = "door_" + x + "_" + y;
		if (Beards.getRoomFlag(doorKey)) return;
			
		if (Beards.useItem(itemId)) {
			Beards.replaceTile(' ', x, y); 
			Beards.setRoomFlag(doorKey, true);
		} else {
      Beards.modal("A locked door blocks your path.")
    }
	},

  removeDoors: function(door, level) {
    for(j=0; j<level.map.length; j++) {
      row = level.map[j]
      i = row.indexOf(door)
      while (i != -1) {
        if (Beards.getRoomFlag("door_" + i + "_" + j)) {
          row = row.substr(0, i) + '`' + row.substr(i + 1)
          level.map[j] = row
        }
        i = row.indexOf(door, i+1);
      }
    }
  },
  
  stepOnBrush: function(x,y) {
    if (Beards.hasItem('machete')) {
      Beards.replaceTile('`', x, y)
      Beards.setRoomFlag("chopped" + x + "," + y, true)
    } else {
      Beards.modal("Thick brush bars the way.");
      Beards.modal("You might be able to get through with something sharp.");
    }
  },

  applyBrush: function(level) {
    // Add triggers for all brush
    for(j=0; j<level.map.length; j++) {
      row = level.map[j]
      i = row.indexOf('~')
      while (i != -1) {
        if (Beards.getRoomFlag("chopped" + i + "," + j)) {
          row = row.substr(0, i) + '`' + row.substr(i + 1)
          level.map[j] = row
        }

        level.triggers[i + "," + j] = LevelHelper.stepOnBrush
        i = row.indexOf('~', i+1);
      }
    }
  }

};
