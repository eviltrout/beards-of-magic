require(["http://lost-arts.ca/javascripts/levels/level_helper.js"], function () {
	var councilLevel = {
		name: "council",
		description: "Flarn Council Headquarters",
		start: [60,18],
		legend: {
			"O": {code: 0x02,	fg: "bright_white",		bg: "black",		solid: true,	name: "Player"},
			"o": {code: 0x01,	fg: "bright_cyan",		bg: "black",		solid: true,	name: "Council member"},
			"*": {code: 0x2A,	fg: "red",				bg: "black",		solid: false,	name: "Decoration"},
			"~": {code: 0x2A,	fg: "cyan",				bg: "black",		solid: false,	name: "Decoration 2"},
			"#": {code: 0xB1,	fg: "bright_black",		bg: "black",		solid: true,	name: "Wall"},
			"=": {code: 0xDF,	fg: "yellow",			bg: "red",			solid: true,	name: "Table/Bed"},
			"+": {code: 0x08,	fg: "bright_green",		bg: "black",		solid: true,	name: "Small door"},
			"|": {code: 0x0A,	fg: "bright_yellow",	bg: "black",		solid: true,	name: "Big door"},
			"k": {code: 0x1B,	fg: "bright_green",		bg: "black",		solid: false,	name: "Small key",	pickup_as: "small_key"},
			"K": {code: 0x0B,	fg: "bright_yellow",	bg: "black",		solid: false,	name: "Big key",	pickup_as: "big_key"},
			"T": {code: 0xF0,	fg: "bright_yellow",	bg: "green",		solid: true,	name: "Sign"},
			"w": {code: 0xF7,	fg: "blue",				bg: "bright_blue",	solid: false,	name: "Water"},
			"W": {code: 0xF7,	fg: "bright_white",		bg: "bright_blue",	solid: false,	name: "Waves"},
			"`": {code: 0xB0,	fg: "green",			bg: "black",		solid: false,	name: "Grass"},
			"%": {code: 0xB2,	fg: "red",				bg: "white",		solid: false,	name: "Path"},
			";": {code: 0xB1,	fg: "yellow",			bg: "red",			solid: false,	name: "Dirt"},
			"}": {code: 0xF5,	fg: "yellow",			bg: "red",			solid: false,	name: "Failed crops"},
			"{": {code: 0xF4,	fg: "yellow",			bg: "red",			solid: false,	name: "Healthy crops"}
		},
		map: [
"################################################################################",
"################################################################################",
"### K                #```````````````````````````````````````````````````````###",
"###===               #```````````````````````````````````````````````````````###",
"###       o          #``````````````````wwwwwwwwwwwwwwwwwwwwwwwwwwww`````````###",
"###                  #```````````````wwwwwwwwwWWwwwwwwwwwwwwwwwwWWwwww```````###",
"###                  #``````````````wwwwwwwwwwwwwwwwwwwwwWWwwwwwwwwww````````###",
"#############+########`````````````wwwwwwwWWwwwwwwwwwwwwwwwwwwwwwwww`````````###",
"###``````````%```````````````````````wwwwwwwwwwwwwwwwwwwwwwwwwwwww```````````###",
"###``````````%```````````````````````````````````````````````````````````````###",
"###``````````%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%``````````###",
"###``````````````````%````````````````````````````````````````````%``````````###",
"  |%%%%%%%%%%%%%%%%%%%````````````````````````````````````````````%``````````###",
"###`````````%``````````````````````````````````````````########### #############",
"############T###########```````````````````````````````#                     ###",
"####**######~######**###```````````````````````````````#  ======     ======  ###",
"######**####~####**#####```````````````````````````````#                     ###",
"########**##~##**#######```````;;};;;;;;;;;;};;````````#  ======     ======  ###",
"##########**~**#########```````````````````````````````#                     ###",
"####~~~~~~~~*~~~~~~~~###```````;;;;;;;};;;;;;;;````````#  ======     ======  ###",
"##########**~**#########```````````````````````````````#                     ###",
"########**##~##**#######```````;;;;};;;;;};;;;;````````#  ======  k  ======  ###",
"######**####~####**#####```````````````````````````````#                     ###",
"####**######~######**###########################################################",
"################################################################################",
		],

		enterRoom: function() {
			////////////////
			// Intro text //
			////////////////
			Beards.modalOnce("You awaken to the sound of the summoning bell. A member of the Council has a task for you!");
		},

		triggers: {
			///////////
			// Doors //
			///////////
			"13,7":  function(x, y) {
				LevelHelper.unlockDoor('small_key', x,y);
			},
			"2,12":  function(x, y) {
				LevelHelper.unlockDoor('big_key', x, y);
			},

			///////////
			// Exits //
			///////////
			"-1,12":  function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/minefield.js", 79, 12);
			},

			///////////////////
			// Conversations //
			///////////////////
			"12,14": function() {
				Beards.modal("\"This monument stands as a symbol of our commitment to peace. With light restored to the world, we reject the violence of the past.\"");
			},
				
			"10,4": function() {
				if (Beards.hasItem("old_book") && Beards.hasItem("carrot_seeds")) {
					Beards.modal("Oh wow, you've really found them! Thank you so much young Paladin!", function() {
						Beards.loadRoom("http://lost-arts.ca/javascripts/levels/end_screen.js")
					})
				} else {
					Beards.modal("Ah, I see that you're awake. I hope that you're well-rested, young Paladin.");
					Beards.modal("The time of rebuilding is upon us. Now that you've taken the vow of peace, you're ready to scour the ruins of our world for lost art and science.");
					Beards.modal("Your first task: Find some agricultural resources to improve our basic crops. Return to me when you've found Carrot Seeds and a Farming Book.");					
				}
			}
		}
	}

	LevelHelper.removeDoors('+', councilLevel)
	LevelHelper.removeDoors('|', councilLevel)
	Beards.startRoom(councilLevel);
});




