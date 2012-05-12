* Lord Nightmare/Microsoft did the font
* Stephen Columbus did the music (soundcloud.com/stephen-columbus)


API

# Returns true if an inventory item was used
Beards.userItem(itemId)
  
# Set a flag by name, restricted to the current room
Beards.setRoomFlag(flag, value) 
    
# Get a flag by name, restricted to the current room
Beards.getRoomFlag(flag)

# Replace a tile on the map with another
Beards.replaceTile: (c, x, y)

# Display a modal message
Beards.modal(message)

# Display a modal message, but only once even if the method is called again
Beards.modalOnce(message)

# Teleport the player to a certain place in the same room
Beards.teleport(x, y)

# The call that tells the Beard engine to load and start the level
Beards.startRoom(level)