var level = {
	name: "start",
    start: [60,18],
	description: "Flarn Council Headquarters",
    legend: {
		"O": {code: 0x02,	fg: "bright_white",		bg: "black",		solid: true,	name: "Player"},
		"o": {code: 0x01,	fg: "bright_cyan",		bg: "black",		solid: true,	name: "Council member"},
		"*": {code: 0x2A,	fg: "red",				bg: "black",		solid: false,	name: "Decoration"},
		"#": {code: 0xB1,	fg: "bright_black",		bg: "black",		solid: true,	name: "Wall"},
		"=": {code: 0xDF,	fg: "yellow",			bg: "red",			solid: true,	name: "Table/Bed"},
		"+": {code: 0x08,	fg: "bright_green",		bg: "black",		solid: true,	name: "Small door"},
		"|": {code: 0x0A,	fg: "bright_yellow",	bg: "black",		solid: true,	name: "Big door"},
		"k": {code: 0x1B,	fg: "bright_green",		bg: "black",		solid: false,	name: "Small key"},
		"K": {code: 0x0B,	fg: "bright_yellow",	bg: "black",		solid: false,	name: "Big key"},
		"w": {code: 0xF7,	fg: "blue",				bg: "bright_blue",	solid: false,	name: "Water"},
		"W": {code: 0xF7,	fg: "bright_white",		bg: "bright_blue",	solid: false,	name: "Waves"},
		"`": {code: 0xB0,	fg: "green",			bg: "black",		solid: false,	name: "Grass"}
	},
	map: [
"################################################################################",
"################################################################################",
"### K                #                    `  `    ````````                   ###",
"###===               #                 ``````````````````````````````        ###",
"###       o          #               ```wwwwwwwwwwwwwwwwwwwwwwwwwwww```      ###",
"###                  #              `wwwwwwwwwWWwwwwwwwwwwwwwwwwWWwwww``     ###",
"###                  #         `  ``wwwwwwwwwwwwwwwwwwwwwWWwwwwwwwwww`       ###",
"#############+########          ` `wwwwwwwWWwwwwwwwwwwwwwwwwwwwwwwww```      ###",
"###                             `````wwwwwwwwwwwwwwwwwwwwwwwwwwwww``````     ###",
"###                              ``````````````````````````````````          ###",
"###                             ```  ```` `````  ``````````` `  ```          ###",
"###                                                                          ###",
"###                                                                          ###",
"  |                                                    ########### #############",
"##########################                             #                     ###",
"####**##############**####                             #  ======     ======  ###",
"######**##########**######                             #                     ###",
"########**######**########                             #  ======     ======  ###",
"##########**##**##########                             #                     ###",
"############**############                             #  ======     ======  ###",
"##########**##**##########                             #                     ###",
"########**######**########                             #  ======  k  ======  ###",
"######**##########**######                             #                     ###",
"####**##############**##########################################################",
"################################################################################",
	],

	music: "welcome",

	triggers: {
		"61,18": /* showText(self.introText) */ function() { alert('Welcome to the story!'); },
		"5,13": function() { alert('hi'); },
		"2,13": "" /* openDoor(2,13) */,
	}
			//"openDoor(2,13)"}
			//{"0,13": "exitTo('meadow')"},
			//{"13,7": "openDoor(13,7)"},
			//{"10,4": "conversation(self.convCouncil)"}
			
}

var introText = "You awaken to the sound of the summoning bell. A member of the Council has a task for you!";
var convCouncil = "Ah, I see that you're awake. I hope that you're well-rested, young Paladin.";
Beards.startRoom(level);
