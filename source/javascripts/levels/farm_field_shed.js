require(["http://lost-arts.ca/javascripts/levels/level_helper.js"], function () {
	var farmFieldShedLevel = {
		name: "farmFieldShed",
		description: "Abandoned Farm (Shed)",
		start: [38,0],
		legend: {
			"O": {code: 0x02,	fg: "bright_white",		bg: "black",		solid: true,	name: "Player"},
			"#": {code: 0xB1,	fg: "bright_black",		bg: "black",		solid: true,	name: "Wall"},
			"=": {code: 0xDF,	fg: "yellow",			bg: "red",			solid: true,	name: "Table/Bed"},
			"T": {code: 0xF0,	fg: "bright_yellow",	bg: "green",		solid: true,	name: "Sign"},
			"w": {code: 0xF7,	fg: "blue",				bg: "bright_blue",	solid: false,	name: "Water"},
			"W": {code: 0xF7,	fg: "bright_white",		bg: "bright_blue",	solid: false,	name: "Waves"},
			"`": {code: 0xB0,	fg: "green",			bg: "black",		solid: false,	name: "Grass"},
			"%": {code: 0xB2,	fg: "red",				bg: "white",		solid: false,	name: "Path"},
			";": {code: 0xB1,	fg: "yellow",			bg: "red",			solid: false,	name: "Dirt"},
			"}": {code: 0xF5,	fg: "yellow",			bg: "red",			solid: false,	name: "Failed crops"},
			"$": {code: 0xE8,	fg: "yellow",			bg: "black",		solid: false,	name: "Carrot Seeds", pickup_as: "carrot_seeds"},
			"&": {code: 0xE8,	fg: "red",				bg: "black",		solid: false,	name: "Carrot Seeds", pickup_as: "carrot_seeds"},
		},
		map: [
"                                                                                ",
"                                                                                ",
"                                                                                ",
"                                                                                ",
"                                                                                ",
"                                                                                ",
"                                                                                ",
"     ###################                                                        ",
"     ###################                                                        ",
"     ###             ###                                                        ",
"     ###      $      ###                                                        ",
"     ###             ###                                                        ",
"     ###             ###                                                        ",
"     ###             ###                                                        ",
"     ######### #########                                                        ",
"     ######### #########                                                        ",
"                                                                                ",
"                                                                                ",
"                                                                                ",
"                                                                                ",
"                                                                                ",
"                                                                                ",
"                                                                                ",
"                                                                                ",
"                                                                                ",
		],

		triggers: {
			///////////
			// Exits //
			///////////
			"14,16":  function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/farm_field.js", 13, 20);
			},

			///////////////////
			// Conversations //
			///////////////////
			"14,10": function() {
				Beards.modalOnce("You found the carrot seeds!");
				Beards.setRoomFlag('have_carrots', true);        
			},
		},
		update: function(elapsed) {
			if (!Beards.getRoomFlag('have_carrots')) {
				if ((elapsed % 400) < 200) {
					Beards.replaceTile('&', 14, 10, false)
				} else {
					Beards.replaceTile('$', 14, 10, false)
				}
			}
		}

	}

	Beards.startRoom(farmFieldShedLevel);
});




