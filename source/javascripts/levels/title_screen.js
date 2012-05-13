require(["http://beard2/levels/level_helper.js"], function () {
	var titleLevel = {
		  name: "title",
		  description: "Title Screen",
		  start: [40, 13],
		  legend: {
			"a": {code: 0x61, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"b": {code: 0x62, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"c": {code: 0x63, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"d": {code: 0x64, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"e": {code: 0x65, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"f": {code: 0x66, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"g": {code: 0x67, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"h": {code: 0x68, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"i": {code: 0x69, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"j": {code: 0x6A, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"k": {code: 0x6B, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"l": {code: 0x6C, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"m": {code: 0x6D, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"n": {code: 0x6E, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"o": {code: 0x6F, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"p": {code: 0x70, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"q": {code: 0x71, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"r": {code: 0x72, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"s": {code: 0x73, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"t": {code: 0x74, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"u": {code: 0x75, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"v": {code: 0x76, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"w": {code: 0x77, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"x": {code: 0x78, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"y": {code: 0x79, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"z": {code: 0x7A, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			":": {code: 0x3A, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"[": {code: 0x5B, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"]": {code: 0x5D, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"7": {code: 0x37, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"/": {code: 0x2F, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			"-": {code: 0x2D, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			".": {code: 0x2E, fg: "bright_white",   bg: "black",    solid: true,  name: "Letter"},
			

			"A": {code: 0xB2, fg: "red",   bg: "black",    solid: true,  name: "Fog"},    
			"B": {code: 0xB0, fg: "bright_red",   bg: "black",    solid: true,  name: "Fog"},
			"C": {code: 0xB1, fg: "bright_red",   bg: "black",    solid: true,  name: "Fog"},
			"D": {code: 0xB2, fg: "bright_red",   bg: "black",    solid: true,  name: "Fog"},

			"E": {code: 0xB2, fg: "bright_blue",   bg: "black",    solid: true,  name: "Fog"},
			"F": {code: 0xB1, fg: "bright_blue",   bg: "black",    solid: true,  name: "Fog"},
			"G": {code: 0xB0, fg: "bright_blue",   bg: "black",    solid: true,  name: "Fog"},
			"H": {code: 0xB2, fg: "blue",   bg: "black",    solid: true,  name: "Fog"},    

			"%": {code: 0xDB, fg: "bright_green", bg: "black", solid: false, name: "Title Words"}
		  },
		  map: [
				"                                                                                ",
				" beardsofmagic present:                                                         ",
				"                                                                                ",
				"       %%       %%%%%%  %%%%%%  %%%%%%%      %%%%%%  %%%%%%  %%%%%%%  %%%%%%    ",
				"      %%       %%  %%  %%         %%        %%  %%  %%  %%     %%    %%         ",
				"     %%       %%  %%  %%%%%%     %%        %%%%%%  %%%%%%     %%    %%%%%%      ",
				"    %%       %%  %%      %%     %%        %%  %%  %% %%      %%        %%       ",
				"   %%%%%%%  %%%%%%  %%%%%%     %%        %%  %%  %%   %%    %%    %%%%%%        ",
				"                                                                                ",
				"                                                                                ",
				"                         ABCCDDDDCCCBA        ABCCCCCCBA                        ",
				"              ACDDDDDDDCCCCCCCCCCCCCCCCCCCCDDDBA       ABCCCCCCCBA              ",
				"             BDDDDDDDDCCCCCCCCCCCCCCCCCCCCDDDCCCBA ABCCCCCCCCCCCCBA             ",
				"             BDDDDDBA    ABCCCCCCCCBA     ABCCCDDDCCCCCCCCCCCCCCDDCA            ",
				"            ABDDDCA                         ABDDDCCCCBA       ACDDCA            ",
				"          ABCCCCCCCCCCCCDDDDDBA     ABCCCCCCCCDDDCBA      BCDDDCCCCCCBA         ",
				"               ABCCCCCCCBA ABDDDCCCCCCCDDDCCCCCCCDDDDDDCCCCCCDDDBA              ",
				"                       ABCCCCCCCCDDCA      ABCDDDCCCCCCCBA                      ",
				"                         ABCCCCCCBA          ABCCCCCCCBA                        ",
				"                                                                   press enter  ",
				"                                                                      to start  ",
				"     made for to jam 7 by: robin ward / eviltrout.com                           ",
				"                           derek quenneville / techknight.com                   ",
				"           [sound floater] stephen columbus / soundcloud.com/stephen-columbus   ",
				"                                                                                ",
			   ],

			hitEnter: function() {
				Beards.loadRoom("http://beard2/levels/sleep.js");
			},

		  triggers: {},
	}

	Beards.startRoom(titleLevel);
});



