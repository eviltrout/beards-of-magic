var level = {

  map : [
         ["##########"],
         ["#        #"],
         ["#        #"],
         ["#        #"],
         ["##########"],
        ]


  triggers: {
  	"61,18": function() {
  		alert("hello")
  	}
  }

};

Beards.startRoom(level);