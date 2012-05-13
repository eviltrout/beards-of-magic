require(["http://lost-arts.ca/javascripts/levels/level_helper.js"], function () {
	var farmFieldLevel = {
		name: "farmField",
		description: "Abandoned Farm (Field)",
		start: [54,0],
		legend: {
			"O": {code: 0x02,	fg: "bright_white",		bg: "black",		solid: true,	name: "Player"},
			"#": {code: 0xB1,	fg: "bright_black",		bg: "black",		solid: true,	name: "Wall"},
			"^": {code: 0xB2,	fg: "yellow",			bg: "green",		solid: true,	name: "Roof"},
			"=": {code: 0xDF,	fg: "yellow",			bg: "red",			solid: true,	name: "Table/Bed"},
			"T": {code: 0xF0,	fg: "bright_yellow",	bg: "green",		solid: true,	name: "Sign"},
			"w": {code: 0xF7,	fg: "blue",				bg: "bright_blue",	solid: false,	name: "Water"},
			"W": {code: 0xF7,	fg: "bright_white",		bg: "bright_blue",	solid: false,	name: "Waves"},
			"`": {code: 0xB0,	fg: "green",			bg: "black",		solid: false,	name: "Grass"},
			"%": {code: 0xB2,	fg: "red",				bg: "white",		solid: false,	name: "Path"},
			";": {code: 0xB1,	fg: "yellow",			bg: "red",			solid: false,	name: "Dirt"},
			":": {code: 0xB1,	fg: "red",				bg: "yellow",		solid: false,	name: "Dirt"},
			"}": {code: 0xF5,	fg: "yellow",			bg: "red",			solid: false,	name: "Failed crops"},
			"{": {code: 0xF4,	fg: "yellow",			bg: "red",			solid: false,	name: "Healthy crops"},
			"k": {code: 0x1B,	fg: "bright_green",		bg: "black",		solid: false,	name: "Small key",	pickup_as: "small_key"},
			"+": {code: 0x08,	fg: "bright_green",		bg: "black",		solid: true,	name: "Small door"},
			"!": {code: 0xDA,	fg: "yellow",			bg: "white",		solid: true,	name: "Fence (upper-left)"},
			"@": {code: 0xBF,	fg: "yellow",			bg: "white",		solid: true,	name: "Fence (upper-right)"},
			"(": {code: 0xC0,	fg: "yellow",			bg: "white",		solid: true,	name: "Fence (lower-left"},
			")": {code: 0xD9,	fg: "yellow",			bg: "white",		solid: true,	name: "Fence (lower-right)"},
			"<": {code: 0xC4,	fg: "yellow",			bg: "white",		solid: true,	name: "Fence (horizontal)"},
			">": {code: 0xB3,	fg: "yellow",			bg: "white",		solid: true,	name: "Fence (vertical)"},
			"r": {code: 0x09,	fg: "bright_black",		bg:	"black",		solid: true,	name: "Rock"},
			"C": {code: 0xEA,	fg: "bright_white",		bg:	"black",		solid: true,	name: "Cow bones"}
		},
		map: [
"rr```rrrr!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<%<<<<<<<<<<<<<<<<<<<<<<<<@",
"``````rr`>````````````````````````````````````````````%````````````````````````>",
"`````r```>``````r``````````````````C``````````````````%`````````````````r``````>",
"``r``````>````````````````````````````````````````````%````````````````````````>",
"``````r``>`r`````````````````````````````````````````%`%```````````````````````>",
"`````````>``````````%%%%%%%%%%%%````%%%%%%%%%%%%%%%%%```%%%%%%%%%%%%%%%%%%%````>",
"`````````>````r`````%;;;;;;;;;;;;``;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;};;;;;;;%````>",
"```r`````>``````````%;;;;;;;;;;;;;;};;;;;;;;;;;;;;;;;;;;;;;};;;;;;;;;;;;;;`````>",
"`````````>``````````%;;;;;};;;;;;;;;;;;;;;;;;};;;;;;;;;;;;;;;;;;;;;;;;;;;`%````>",
"``r``````>``````````%;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;};;;`;%````>",
"``````r``>``````````%;;;;;;;;;;;;;;;;;};;;;;;;;;;;;;;;};;;;;;;;;;;;;;;;;;;%````>",
"`````````>``r```````%:::::::::::::::::::::::::::::::::::::::::::::::::::::%````>",
"r````````>``````````%;;;;;;;;;;;;;;;;;;;;;;;;`;;;;;;;;;;;;;;;;;;;;;;;;;;;;%````>",
"``````r``>```````````;;;;;;;;;;;;;;;};;;;;;`;;;;;;;;;;;;;;;;;;;;;;};;;;;;;%````>",
"```r`````>``````````%`;;};;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;%````>",
"`````````>``````````%;`;;;;;;;;;;;;;;;;;;;};;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;%````>",
"`````````>`#####````%;;`;;;;;;;};;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;};;;;;;;;%````>",
"````r````>`#^^^#````%:::`:::::::::::::::::::::::::::::::::::::::::::::::::%````>",
"`````````>`#^^^#````%;;;;`;};;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;%````>",
"```r`````>`##+##````%;;;;;;;;;;;;;;;;;;;;;;;;};;;;;;;;;`;};;;;;;;;;;;;;;;;%````>",
"`````````>```%``````%;;;;;;;;;;;;;;;;};;;;;;;;;;;;;;;;`;;;;;;;;;;;;;;;`;;;%````>",
"`r`k``r``>```%``````%;;;;;;;;;;;;;;;;;;;;;;;;;;;};;;;;;;;;;;;;;;};;;;;;`;;%````>",
"`````````>```%``````%;;;;};;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;%````>",
"```r`````>```%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%````>",
"`````````(<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<)",
		],

		triggers: {
			///////////
			// Doors //
			///////////
			"13,19":  function(x, y) {
				LevelHelper.unlockDoor('small_key', x,y);
			},

			///////////////////
			// Conversations //
			///////////////////
			"35,2": function() {
				Beards.modal('The bones of a long-dead farm animal... You hope.');
			},

			///////////
			// Exits //
			///////////
			"54,-1":  function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/farm.js", 54, 24);
			},
			"2,-1":  function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/farm.js", 2, 24);
			},
			"3,-1":  function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/farm.js", 3, 24);
			},
			"4,-1":  function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/farm.js", 4, 24);
			},
			"13,18":  function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/farm_field_shed.js", 14, 15);
			},
		}
	}

	LevelHelper.removeDoors('+', farmFieldLevel)

	Beards.startRoom(farmFieldLevel);
});




