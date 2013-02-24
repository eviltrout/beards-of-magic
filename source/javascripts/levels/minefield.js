var minefieldLevel = {
	description: "Minefield",
	start: [79, 12],
	legend: {
		"O": {code: 0x02,	fg: "bright_white",		bg: "black",		solid: true,	name: "Player"},
		"#": {code: 0xB1,	fg: "bright_black",		bg: "black",		solid: true,	name: "Wall"},
		"T": {code: 0xF0,	fg: "bright_yellow",	bg: "green",		solid: true,	name: "Sign"},
		"t": {code: 0xF0,	fg: "bright_yellow",	bg: "magenta",		solid: true,	name: "Sign"},
		"w": {code: 0xF7,	fg: "blue",				bg: "bright_blue",	solid: false,	name: "Water"},
		"W": {code: 0xF7,	fg: "bright_white",		bg: "bright_blue",	solid: false,	name: "Waves"},
		"`": {code: 0xB0,	fg: "green",			bg: "black",		solid: false,	name: "Grass"},
		"%": {code: 0xB2,	fg: "red",				bg: "white",		solid: false,	name: "Path"},
		";": {code: 0xB0,	fg: "red",				bg: "yellow",		solid: false,	name: "Dirt"},
		"X": {code: 0x58,	fg: "bright_yellow",	bg: "red",			solid: false,	name: "a landmine"},
	},
	map: [
";;;#`````````````````````````````````````````````````######```````#####`````````",
";;;#``````############``````````````````````````;````#;;;;;#```;``#;;;#````;````",
";;;###################```````;;``````````````````````#;;t;;;#`````#;;;#####`````",
"#########;X;;;;;;;;;;##````````````````####```````````#;;;;X;#````#;;;;;;;##````",
"%%%%;;X;;;;;;;;;;;;;;;##``````````````##;;##```````````#;;;;;#````#;;;;;;;;#````",
"#;;T;%;;;;;;;;;;X;;;;;###``````;;`````#;;;##```##########;;;;######;;;;;;;;#````",
"#;;;;;;;XXX;;;;;;;;X;;;;##``````;`````#;;;##``###########;;;;#####;;;;;;%;;###``",
"#;;;;%;;;;;;;;;;;;;;;;;;;##```````````#;X;##`##;;;;;;;;;#;;;;;;;;;;;;;;X;;;;;##`",
"##;;;;;;;;;;;XX;;;;;;;;;;;##`````````##;;;####;;;;;;;;;;;;;;;;;;;;;;;;;X;;T;;;#`",
";##;;;;X;;;;;;;;;;;;;;X;;;;###``````###;;;###;;;;;;X;;;;;;X;;;;X;;;;;;;X;;%;;;#`",
";;##;;;;;;;;;;;;;;;;;;;;;;;;;##########;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;X;;;;%;#`",
";;;##;;;;;;;;######;;;;;;;;;X;;;;;;;;;;;;;;;;X;;;;;;;;;;;;;;;;;;;;;;;;#####;%;##",
";;;;###########```##;;;;;;;;;;;;;XX;;;;;;;;X;;;;;;;;;;;;;;;;;;;X;;;;;##```##%%%%",
";;;#```````````````##;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;XX;;;;;X;;;########`````#####",
";;#`````````````````##;;X;;;X;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;##`````````````````",
";#``;````````````````##;;X;;;;;;;X;;;;;;;####;;;;;;;;;X;;;;;##``````````````````",
"#``;;;````````````````##;;;;;;;;;X;;;;;;;#``##;;;;;;;;;;;;;##```````````````````",
"````;``````````````````##;;;###############``###############`````````````;``````",
"````````````````````````##;##```````````````````````````````````````````````````",
"`````````````````````````###`````````````````````````````````````;;;````````````",
"`````````;X`````````````````````````````````````````````````````;X``````````````",
"``````````;``````````````````````````````;```````````````````````;``````````````",
"`````````````````````````````````````````X;`````````````````````````````````````",
"`````````````````````````````````````````;``````````````````````````````````````",
"````````````````````````````````````````````````````````````````````````````````",
	],

	enterRoom: function(x, y) {
		this.enteredX = x
		this.enteredY = y
	},

	stepOnMine: function (x, y) {
		Beards.hidePlayer();
		Beards.replaceTile('#', x, y, false);
		setTimeout(function() {
			Beards.modal('You were killed by a landmine!', function() {
				Beards.replaceTile('X', x, y, false);
				Beards.teleport(this.enteredX, this.enteredY)
				Beards.showPlayer()				
			}.bind(this));
		}.bind(this), 1000)		
	},

	triggers: {

		///////////
		// Exits //
		///////////
		"-1,4": function(x, y) { Beards.loadRoom("http://lost-arts.ca/javascripts/levels/crossroads.js", 79, 4) },
		"80,12": function(x, y) { Beards.loadRoom("http://lost-arts.ca/javascripts/levels/start.js", 0, 12) },

		///////////////////
		//     Signs     //
		///////////////////
		"3,5": function() { Beards.modal("WARNING: Active Landmines!"); },
		"74,8": function() { Beards.modal("WARNING: Active Landmines!"); },
		"56,2": function() { Beards.modal("Holy cow why did you come over here?! Minefields are dangerous!"); },
	}
};

// Add triggers for all mines
for(j=0; j<minefieldLevel.map.length; j++) {
	row = minefieldLevel.map[j]
	i = row.indexOf('X')
	while (i != -1) {
		minefieldLevel.triggers[i + "," + j] = minefieldLevel.stepOnMine
		i = row.indexOf('X', i+1);
	}
}

Beards.startRoom(minefieldLevel);
