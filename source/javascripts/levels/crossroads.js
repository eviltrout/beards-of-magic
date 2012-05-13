require(["http://lost-arts.ca/javascripts/levels/level_helper.js"], function () {
	var crossroadsLevel = {
		name: "crossroads",
		description: "The Crossroads",
		start: [79, 4],
		legend: {
			"O": {code: 0x02,	fg: "bright_white",		bg: "black",		solid: true,	name: "Player"},
			"o": {code: 0x02,	fg: "bright_cyan",		bg: "black",		solid: true,	name: "NPCs"},
			"g": {code: 0x02,	fg: "bright_yellow",	bg: "black",		solid: true,	name: "NPCs"},
			"#": {code: 0xB1,	fg: "bright_black",		bg: "black",		solid: true,	name: "Wall"},
			"D": {code: 0xB2,	fg: "white",			bg: "black",		solid: true,	name: "Rocks"},
			"C": {code: 0xB1,	fg: "white",			bg: "black",		solid: true,	name: "Rocks"},
			"B": {code: 0xB0,	fg: "white",			bg: "black",		solid: true,	name: "Rocks"},
			"A": {code: 0xB1,	fg: "white",			bg: "black",		solid: true,	name: "Rocks"},
			"=": {code: 0xDF,	fg: "yellow",			bg: "red",			solid: true,	name: "Table/Bed"},
			"T": {code: 0xF0,	fg: "bright_yellow",	bg: "green",		solid: true,	name: "Sign"},
			"w": {code: 0xF7,	fg: "blue",				bg: "bright_blue",	solid: false,	name: "Water"},
			"W": {code: 0xF7,	fg: "bright_white",		bg: "bright_blue",	solid: false,	name: "Waves"},
			"`": {code: 0xB0,	fg: "green",			bg: "black",		solid: false,	name: "Grass"},
			"%": {code: 0xB2,	fg: "red",				bg: "white",		solid: false,	name: "Path"},
			";": {code: 0xB0,	fg: "red",				bg: "yellow",		solid: false,	name: "Dirt"},
			"L": {code: 0xB2,	fg: "bright_green",		bg: "green",		solid: true,	name: "Leaves"},
			"Z": {code: 0xB2,	fg: "red",				bg: "bright_green",	solid: true,	name: "Bark"},
			"r": {code: 0x09,	fg: "bright_black",		bg:	"black",		solid: true,	name: "Rock"},
			"~": {code: 0x91,	fg: "bright_green",		bg: "black",		solid: true,	name: "Thick brush"},
		},
		map: [
"BCDCCBBBCCCCCCCBBBCCCCCCCCCDDDCDDDCCCDDCBBCDDDDBA%BCDCBBBCDDDDDDDDDDDDDDDDDD####",
"ABBDDDCDD`A`BC`BD``DB`CA````B```CA``CB`D``BC`~~~~~~~```C`BB`C`C`B```AB`B```###;;",
"CADBDDBC```````C```````B`````````B```A```````````%```````A````B````````D````####",
"ADDBD````````````````````````````````````````````%````````````````````````````##",
"DDD``AB``````````````````````````````````````````%`````````````````````````%%%%%",
"DD```````````````````````````````````````````````%````````````````````````%%```#",
"D````````````````````````````````````````````````%```````````````````````%%````#",
"D````````````````````````%%%%%%%%%%%%%%%%%%%%%%%%%%`````````````````````%%`````#",
"r````````````````````````%rrrrrrrrLLLLLrrrrrrrrrrr%%%%%%%%%%%%%%%%%%%%%%%``````#",
"r````````````````````````%rwwwwwwLLLLLLLwwwwwwwwwr%``````````````````````````###",
"r````````````````````````%rwwwwwwLLLLLLLwwwwwwwwwr%`````````````````````````#;;;",
"%%%%%%%%%%%%%%%%%%%%%%%%%%rwwwwwwwLLLLLwwwwwwwwwwr%````````````````````````#;;;;",
"r````````````````````````%rwwwwwwwwZZZwwwwwwwWWwwr%````````````````````````##;;;",
"r````````````````````````%rwwwwwwwwZZZwwwwwwwwwwwr%`````````````````````````#;;;",
"r````````````````````````%rwwWWwwwwZZZwwwwwwwwwwwr%`````````````````````````#;;;",
"r````````````````````````%rwwwwwwwwZZZwwwwwwwwwwwr%``````````````````````````##;",
"r````````````````````````%rwwwwwwwwZZZwwwwwwwwwwwr%```````````````````````````##",
"r`````````o``````````````%rwwwwwww;ZZZ;wwWWwwwwwwr%````````````````````````````#",
"A````````````````````````%rwwwwwww;;;;;wwwwwwwwwwr%````````````````````````````#",
"A````````````````````````%rwwwwwwwwwwwwwwwwwwwwwwr%`````````````````g``````````#",
"D````````````````````````%rrrrrrrrrrTrrrrrrrrrrrrr%````````````````````````````#",
"CAAAA````````````````````%%%%%%%%%%%%%%%%%%%%%%%%%%````````````````````````````D",
"DDDDDDAA``````````````````````````````%```````````````````````````````````````DC",
"CADBABAADAAA```D`DCCCA```DDDDC````CCCC%````````AB``````AD``````CC``````B`````ADD",
"CDDDDDAADDAADAAAABBBAADDDACCCDBCBDAAAB%DDDDDADADDDDADDDADDDAADDCDDCDDCCDCDCDCDDD",
		],

		triggers: {
			///////////
			// Exits //
			///////////
			"80,4": function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/minefield.js", 0, 4);
			},
			"-1,11": function(x, y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/trader_camp.js");
			},
			"38,25": function(x,y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/farm.js", 38, 0);
			},
			"49,-1": function(x,y) {
				Beards.loadRoom("http://lost-arts.ca/javascripts/levels/library.js", 49, 24);
			},

			///////////////////
			// Conversations //
			///////////////////
			"36,20": function() {
				Beards.modal("\"Only this lone oak tree, among all its brothers in the Crossroads, withstood the whole of the dark times.\"");
			},
				
			"68,19": function() {
				Beards.modal("\"I want to be a Paladin, but the council won't use anyone who hasn't learned to read yet.\"");
			},
				
			"10,17": function() {
				Beards.modal("\"Can we really recover tools and knowledge that were lost?\"");
			},
		}
	}

	LevelHelper.applyBrush(crossroadsLevel);
	Beards.startRoom(crossroadsLevel);
});




