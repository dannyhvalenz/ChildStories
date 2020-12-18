var CaressServer = require('caress-server');
var caress = new CaressServer('0.0.0.0', 3333, {json: true});

caress.on('tuio', function(msg){
  console.log(msg);
});