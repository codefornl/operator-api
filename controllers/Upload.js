(function() {
  'use strict';
  module.exports.postupload = function(req, res, next) {
    res.setHeader('content-type', 'application/json');
    if(req.swagger.params.file){
      res.end(JSON.stringify({"status": "ok"}, null, 2));
    } else {
      res.end(JSON.stringify({"status": "nok"}, null, 2));  
    }
  };
}());
