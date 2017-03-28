(function() {
    'use strict';
    var models = require('../models');
    var Operator = models.Operator;
    module.exports.getoperator = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "GET"}, null, 2));
    };

    module.exports.postoperator = function(req, res, next) {
      var params = req.swagger.params.body.value;
      var code = params.code || params.name.replace(/[`~!@#$%^&*()\ \_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, '').toLowerCase();
      var tempoperator = new Operator.model({
        code: code,
        name: params.name,
        url: params.url || null,
        country: params.country || null,
        entered_by: user
      });

      tempoperator.save(function (err, operator, count) {
        res.setHeader('content-type', 'application/json');
          if (err) {
            next(err);
          } else {
            res.end(JSON.stringify(operator, null, 2));
          }
      });

    };

    module.exports.putoperator = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "PUT"}, null, 2));
    };
    module.exports.deleteoperator = function(req, res, next) {
        var params = req.swagger.params;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({"operation": "DELETE"}, null, 2));
    };
}());
