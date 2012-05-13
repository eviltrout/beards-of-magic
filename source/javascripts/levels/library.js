Beards.startRoom({
  description: "Outside the Library",
  start: [49, 24],
  legend: {
    "D": {code: 0xB2, fg: "white", bg: "black", solid: true,  name: "Rocks"},
    "C": {code: 0xB1, fg: "white", bg: "black", solid: true,  name: "Rocks"},
    "B": {code: 0xB0, fg: "white", bg: "black", solid: true,  name: "Rocks"},
    "A": {code: 0xB1, fg: "white", bg: "black", solid: true,  name: "Rocks"},
    'o': {code: 0x02, fg: "bright_green", bg: "black", solid: true,  name: "Person"},
    "t": {code: 0xF0, fg: "bright_yellow", bg: "magenta", solid: true,  name: "Sign"},
    "`": {code: 0xB0, fg: "green", bg: "black", name: "Grass"},
    "%": {code: 0xB2, fg: "red", bg: "white", name: "Path"},
    "#": {code: 0xB1, fg: "blue", bg: "white", solid: true, name: "Building"},
    "w": {code: 0xF7, fg: "blue",       bg: "bright_blue",  solid: false, name: "Water"},
    "W": {code: 0xF7, fg: "bright_white",   bg: "bright_blue",  solid: false, name: "Waves"},
    "+": {code: 0xC5, fg: "black", bg: "bright_white", solid: true, name: "Window"},

  },
  map: [
        "ABDDDDDDDDCCCCCCCCCCCDDDCCCCCCBAAABBCCCCCCDCCBCCCCCDDDDDDCCCCCCCBBAAABCCCCCCCBBA",
        "BDDDDDDDDDCCCCCCCDDDDDDDCCCCCCCCCBCDDDDDDCDCCCDDDCCDDDDDDDDDCCCDDDCCDDDCCCCCDDDD",
        "CDDDDDDDDDDDDDDDDDDCCCCDDDDDDCCCDDDDDDDDDCCCCDDDCCCDDCCCCDDDCCCCCCCCCBADDDCCDDDD",
        "CDDDDDDCDCDDDDCCCDDDDDDDDDCCCCDDDDDDDDDDDCCCCDDCA``````ABDDDCCCCCCCCCCCCCDDDDDDD",
        "DDDCDDDCDDDDDDDDDDDCCCCDDDDDDDCCDDDBCDDDDDCCCCBA`````````ABCCCCCCCCCCCCCCDDDDDDD",
        "DDDDDDDDDDDDDDDDCCDDDDDDDDCCCCCCCCCCCCCDDDCBA``````````##`###########ABCCDDDDDDD",
        "DDDDDBBBDDDDDDDDDCBBCCCCCCCCCDDDCCCCCCCCBA````````````#+#+#+#+##+#+#+#+##CDDDDDD",
        "CDDBBBDDDDDDDDDDCCDDDDDDDDDDCDDDCCCCBA```````````````####################CDDDDDD",
        "CDDCDDDDDDDDDCCCCCCCCCCCCCCCCDDDCBA``````````````````##+#+#+####+#+#+#+##`DDDDDD",
        "BCDDDDDDDDDCCBA`ABCCCCCCCCCCCCBA`````````````````````######### ##########`BCDDDD",
        "ACDDDDDDDDBA`````````````wwwwwwwwwwwwww```````````````````````%```````````ABDDDD",
        "ABDDDCCDBA``````````````wwwwwwwwwwWWwwwwwwwwww````````````````%`````````````ACDD",
        "BCDDCCCC```````````````wwwwwwwWWwwwwwwwwWWwwwwwww`````````````%``````````````ABD",
        "CDDDCCCC```````o`````````wwwwwwwwwwwwwwwwwwwwww`````````````%%%````````````````C",
        "BDDDCCDDBA``````````````````````````````````````````````%%%%```````````````````C",
        "CDDDBCDDDB``````````````````````````````````````````%%%%```````````````````````C",
        "CDDDACDDDB````````````````````````````````````````%%```````````````````````````C",
        "DDDDBDDDDDCBA````````````````````````````````````%````````````````````````````AD",
        "CDDDDDDDDCDDDCCCCBBBCCBBBCBA`````````````````````%```````````````o````````````BD",
        "CDDDDDBBBCDDDCCCCBBBCCBBBCCCCCCCCBA````````````t%%``````````````````````````ABDD",
        "BCDDDDCCCCDDDDDCCBBBCCBBBCCCCCCCDCCAA````````````%```````````````````````ABCCCDD",
        "CDDBBCCCCCCCCCCCCCCCCCCCCCDDDDCCDCCBBBBBA````````%```ABCCCCBA```````````ACDDDDDD",
        "DDDDDDDDDDDDDCCCCCCCCCCCCCCDDDCCCBBBBBBBBBCCBA```%ABCDDDDDDDDCCCCCCCCCCCCDDDDDDD",
        "CDDCCBBBCCCCCDDDDDDDDDDDDDDDDDCDDDCDDDDCBBCDDCA``%BCDDDDDDDDDDDDDDCCCCCCCDDDDDDD",
        "BCDCCBBBCCCCCCCBBBCCCCCCCCCDDDCDDDCCCDDCBBCDDDDBA%BCDCBBBCDDDDDDDDDDDDDDDDDDDDDD"
       ],
  
  triggers: {
    "22,7": function() {

      if (Beards.useItem('moonshine')) {
        Beards.modal("\"Here, take this machete!\"");
        Beards.addItem('Machete', 'machete')
      } else {
        if (Beards.hasItem('machete')) {
          Beards.modal("ZZzzzz...");  
        } else {
          Beards.modal("\"Briingsh meee a dreenk!\"");    
        }        
      }
      
    },
    "49,25": function() {
      Beards.loadRoom("http://lost-arts.ca/javascripts/levels/crossroads.js", 49, 0);
    },    
    "62,9": function() {
      Beards.loadRoom("http://lost-arts.ca/javascripts/levels/inner_library.js");
    },        
    "47,19": function() {
      Beards.modal("\"Ye olde Library\"");
    },        
    "15,13": function() {
      Beards.modal("\"It's so cold at night.\"");
    },    
    "65,18": function() {
      Beards.modal("\"I miss my wife every day.\"");
    },    
  }
  
});