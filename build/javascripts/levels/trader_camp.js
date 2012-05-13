Beards.startRoom({
  description: "Trading Post",
  start: [79, 13],
  legend: {
    "D": {code: 0xB2, fg: "white",   bg: "black",    solid: true,  name: "Rocks"},
    "C": {code: 0xB1, fg: "white",   bg: "black",    solid: true,  name: "Rocks"},
    "B": {code: 0xB0, fg: "white",   bg: "black",    solid: true,  name: "Rocks"},
    "A": {code: 0xB1, fg: "white",   bg: "black",    solid: true,  name: "Rocks"},
    'o': {code: 0x02, fg: "bright_green",   bg: "black",    solid: true,  name: "Trader"},
    'O': {code: 0x02, fg: "bright_cyan",   bg: "black",    solid: true,  name: "Trader Bibuz"},
    "t": {code: 0xF0, fg: "bright_yellow",  bg: "magenta",  solid: true,  name: "Sign"},
    "`": {code: 0xB0, fg: "green",      bg: "black",    solid: false, name: "Grass"},
    "%": {code: 0xB2, fg: "red",        bg: "white",    solid: false, name: "Path"},
    "[": {code: 0xCC, fg: "white",        bg: "red",    solid: true, name: "Hut"},
    "]": {code: 0xB9, fg: "white",        bg: "red",    solid: true, name: "Hut"},
    "/": {code: 0x2F, fg: "white",        bg: "black",    solid: true, name: "Roof"},
    ">": {code: 0x5C, fg: "white",        bg: "black",    solid: true, name: "Roof"},
  },
map: [
        "BCDCCCDDDDDDDDDCBBCCCCCDDDDCCCCCCCCCCCCCCCBAABCCCCCCCCCDDDCCCCCCCCCBBBCCCCCCCCCC",
        "CDDCDDDDDDDDDDDDDDDCCCCCDDDDDDDCCCCCCCCCCCCCDDDCCCCCCDDDDDDDDDDDCCCCDDDDDDCCCCCC",
        "CDDCCDDDDDDDDDDDDDDCCCCCCCCCCCCDDDDDDDDDDDDCDDDCCCCCCCCDDDDDDDDDDDDDDDCCCCCDDDDD",
        "DDDDDDDDDDDDDCDCCBA`````ABCCCCCCCCCCCCCCCCCCCBA``````ABCCCCCCCCCCCCDDDDDDCCCCCBA",
        "DDDDDDCDDDDDDCCA`````````````ABCCCCCCCCCCCBA``````````````````ABCCCDDDCCDDDDCCBA",
        "DDDDDDDDDDDDCCCB```````````````````````````````````````````````````ABCCCCCCCCCCC",
        "DDDDDDDDDDDCBCCC``````````````/>```````````````````````````````````````ABCCCCCCC",
        "CDDDDDDDDDCBBCCB``````O```````[]``````````````````````````````````````````ABCCCC",
        "BDDDCBABDDDCDDCA````````````````````````````````````````````````````````````````",
        "CDDBBCCDDDCCDCB```/>`````````````o``````````/>``````````````````````````````````",
        "BBCCDDCDDDCCCBA```[]````````````````````````[]``````````````````````````````````",
        "ABCDDDCCBA````````````````%`````````````````````````````````````````````````````",
        "ABCCBA````````````````````%```````````````````````````````````````````````t`````",
        "BCCA```````/>````o````````%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",
        "CCC````````[]```````````````````````````````````````````````````````````````````",
        "CCC`````````````````````````````````````````````````````````````````````````````",
        "CDDA````````````````````````````````````````````````````````````````````````````",
        "BDDDBA````````````````````````ABCCCCCBA`````````````````````````````````````````",
        "ACDDCCCCCCCCCCBA`````ABCCCCCCCCCCCCCDDDCCCCBA``````````````````````````````ABCBA",
        "ABCCCCCCCCCCCDDDCCCCCCCCCCCCCCCCCCCCDDDCCCCCCCCBA````````````````````ABCCCCCCCBA",
        "BCDCDDDDDCCCCDDDCCCCCCCCCCCCDDDDCCCCDDDDDCCCCCDDDCCBA`````````````ABCCCCDDDDDDDD",
        "CDDDCCDDDCCCBBBDDDDDDDCCCCCCCCCCCCCCCCDDDCCCCCDDDCCCCCCCCCCCCCCCCCCCCCDDDDDDDCCC",
        "BDDDDDDDDDCDDDBBBCCCCDDDDDDDDDDDDDDDDDDDDCCCCCDDDCCCCCCCCCCCCCCCCCCDDDDCDDDDDDDD",
        "BDDDDCDDDDDDDDCDDDDDCDDDDDDDDDCCCCCCCCDDDDDDDCCCCCCDDDDDCCCCCDDDDDDDDDDDDDDDDDDC",
        "ABDDDCCDDDCDDDCCBBAAABCCCCCCCCCCCCCCCCCCCCCDDDDCCCCCCCBBBCCBBBCBBBCCDDDDDDDDDDDC"
       ],
  
  triggers: {
    "22,7": function() {

      if (Beards.useItem('moonshine')) {
        Beards.modal("\"Thanksh fer the booze. Here, takesh this machete.\"");
        Beards.addItem('Machete', 'machete')
      } else {
        if (Beards.hasItem('machete')) {
          Beards.modal("ZZzzzz...");  
        } else {
          Beards.modal("\"Briingsh meee a dreenk!\"");    
        }        
      }
      
    },
    "33,9": function() {
      Beards.modal("\"These are troubling times.\"")
    },
    "17,13": function() {
      Beards.modal("\"Trader Bibuz has taken to the drink.\"")
    },    
    "74,12": function() {
      Beards.modal("\"Trading Post\"")
    },
    "80,13": function() {
      Beards.loadRoom("http://lost-arts.ca/javascripts/levels/crossroads.js", 0, 11)
    }
  }
  
});
