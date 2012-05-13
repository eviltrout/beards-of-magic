require(["http://lost-arts.ca/javascripts/levels/level_helper.js"], function () {
	var farmLevel = {
		name: "farm",
		description: "Abandoned Farm",
		start: [38,0],
		legend: {
			"O": {code: 0x02,	fg: "bright_white",		bg: "black",		solid: true,	name: "Player"},
			"o": {code: 0x01,	fg: "bright_cyan",		bg: "black",		solid: true,	name: "Angry Man"},
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
			"!": {code: 0xDA,	fg: "yellow",			bg: "white",		solid: true,	name: "Fence (upper-left)"},
			"@": {code: 0xBF,	fg: "yellow",			bg: "white",		solid: true,	name: "Fence (upper-right)"},
			"(": {code: 0xC0,	fg: "yellow",			bg: "white",		solid: true,	name: "Fence (lower-left"},
			")": {code: 0xD9,	fg: "yellow",			bg: "white",		solid: true,	name: "Fence (lower-right)"},
			"<": {code: 0xC4,	fg: "yellow",			bg: "white",		solid: true,	name: "Fence (horizontal)"},
			">": {code: 0xB3,	fg: "yellow",			bg: "white",		solid: true,	name: "Fence (vertical)"},
			"r": {code: 0x09,	fg: "bright_black",		bg:	"black",		solid: true,	name: "Rock"},
			"M": {code: 0xEB,	fg: "bright_cyan",		bg:	"black",		solid: false,	name: "Moonshine", pickup_as: "moonshine"},
			"~": {code: 0x91,	fg: "bright_green",		bg: "black",		solid: true,	name: "Thick brush"},

		},
		map: [
"``````````````````````````````````````%`````````````````````````````````````````",
"``````````````````````````````````````%`````````````````````````````````````````",
"``r```````````````````````````````T```%`````````````````````````````````````````",
"``````````````````````````````````````%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%``````````",
"`````##############^r^^########```````````````````````%;;;;;;;;;;;;;;%``````````",
"`````##`````^^^````^^^````````#rrrrrrrrrrrrrrrrrrrrrr`%:::::::r::::::%``````````",
"`````#``M```^^^```````^^^^^```#`````````````````````r`%;;;;;;;;;;;;;;%``````````",
"`````##`````^^^```^```````````#`````````````````````r`%::::::::::::::%``````````",
"`````#``````^^^```^``````^````#``````rrrrrrr````````r`%;r;;;;;;};;;;;%``````````",
"`````#```````````````````^```##`````rwwwwwwr````````r`%%%%%%%%%%%%%%%%``````````",
"`````#``````````````#``#``````#`````rwwwwwwww```````r`%`````````````````````````",
"`````^^^^```````^^^#``#```````#`````rwwwwwwr`w``````r`%`````````````````````````",
"`````#``````^```^^#``#``^^^```#`````rwWWwwwr````````r`%`````````````````````````",
"`````#`^^^^``````#``#```^##^^`#`````rwwwwwwr`````````r%`````````````````````````",
"`````###^###^##^#``rr##########`````rwwwwwwr``````````r`````````````````````````",
"````````````````````````````````````rwwwwwwr``````````%r````````````````````````",
"`````r```````````````r``````````````wrrrrrr```````````%`r```````````o```````````",
"`````````````````%````````````````````````````````````%`````````````````````````",
"`````````````````%%%r%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%`````````````````````````",
"``````````````````````````````````````````````````````%`````````````````````````",
"``````````````````````````````````````````````````````%```````````````````r`````",
"``````````````````````````````````````````````````````%``````````````````rrrrr``",
"```````````````````````````rrrrrrrrrrrrr``````````````%````````````````rrr```rr`",
"``rr````rrrrr````rrrrrrrrrrr```````````rrrrrrrr````~~~~~~~``rrrrrrrrrrrrr`````rr",
"rr```rrrr```rrrrr```````````````````````````rrrrrrrrrr%rrrrrr````r```````r`````r",
		],

		triggers: {
			///////////
			// Exits //
			///////////
			"38,-1":  function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/crossroads.js", 38, 24);
			},
			"54,25":  function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/farm_field.js", 54, 0);
			},
			"2,25":  function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/farm_field.js", 2, 0);
			},
			"3,25":  function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/farm_field.js", 3, 0);
			},
			"4,25":  function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/farm_field.js", 4, 0);
			},

			///////////////////
			// Conversations //
			///////////////////
			"8,6": function(x,y) {
				Beards.modalOnce("You found a bottle of Moonshine!");
			},

			"34,2": function() {
				Beards.modal('"Smith Family Farm"');
				Beards.modal('"- Home of the world-famous King-Size Carrots -"');
			},
			"68,16": function() {
				Beards.modal("\"Look at this place.\"");
				Beards.modal("\"We fought our whole lives to save what few scraps our grandparents had...\"");
				Beards.modal("\"What the hell was it all for?\""); 
			},
		}
	}

	LevelHelper.applyBrush(farmLevel);

	Beards.startRoom(farmLevel);
});




