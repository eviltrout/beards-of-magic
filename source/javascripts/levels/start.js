var level = {
	name: "start",
    start: [60,18],
	description: "Flarn Council Headquarters",
    legend: {
		"*": {code: 0x2A, colour: "bright_red", bg_colour: "black"},
		"#": {code: 0xB1, colour: "bright_black", bg_colour: "black"},
		"o": {code: 0x02, colour: "bright_yellow", bg_colour: "black"},
		"O": {code: 0x01, colour: "bright_white", bg_colour: "black"},
		"=": {code: 0xDF, colour: "yellow", bg_colour: "black"}
	},	
	map: [
"################################################################################",
"################################################################################",
"###                  #                                                       ###",
"###                  #                                                       ###",
"###       o          #                                                       ###",
"###                  #                                                       ###",
"###                  #                                                       ###",
"#############+########                                                       ###",
"###                                                                          ###",
"###                                                                          ###",
"###                                                                          ###",
"###                                                                          ###",
"###                                                                          ###",
"  +                                                      ########+##############",
"##########################                               #                   ###",
"####**##############**####                               #======     ======  ###",
"######**##########**######                               #                   ###",
"########**######**########                               #======     ======  ###",
"##########**##**##########                               #                   ###",
"############**############                               #======     ======  ###",
"##########**##**##########                               #                   ###",
"########**######**########                               #======     ======  ###",
"######**##########**######                               #                   ###",
"####**##############**##########################################################",
"################################################################################",
	],

	music: "welcome",

	/*triggers: {
		"61,18": function() { alert('Welcome to the story!'); },
		"5,13": function() { alert('hi'); },
		"2,13": "" openDoor(2,13),
	} */
			//"openDoor(2,13)"}
			//{"0,13": "exitTo('meadow')"},
			//{"13,7": "openDoor(13,7)"},
			//{"10,4": "conversation(self.convCouncil)"}
			
}

var introText = "You awaken to the sound of the summoning bell. A member of the Council has a task for you!";
var convCouncil = "Ah, I see that you're awake. I hope that you're well-rested, young Paladin.";
Beards.startRoom(level);