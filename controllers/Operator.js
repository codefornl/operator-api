(function() {
    'use strict';
    var Nominatim = require('node-nominatim2');
    var QueryOverpass = require('query-overpass');
    var nominatim = new Nominatim({
      useragent: 'codefornl-operator-api',
      referer: 'https://github.com/codefornl/operator-api',
      timeout: 1000
    });
    var models = require('../models');
    var Operator = models.Operator;

    /**
     * Cleans a nominatim result into usable content.
     * @param {*} result 
     */
    var clean = function(result){
      var out = {};
      var osm = {};
      if(Array.isArray(result)){
        // get the relation, skip the nodes.
        result = result[0];
      }
        
      if(typeof(result) === "object"){
        out = result.address;
        if(result.osm_type && result.osm_id){
          osm = {type: result.osm_type, id: result.osm_id};
        } else {
          osm = {type: "place_id", id: result.place_id};
        }
        if (out.house_number) delete out.house_number;
        if (out.road) delete out.road;
        if (out.postcode) delete out.postcode;
        if(["ie","nl"].indexOf(out.country_code) !== -1){
          return {
            "jurisdiction": out.town || out.city, 
            "type": "local government", 
            "country": out.country_code,
            "osm": osm
          };
        } else {
          return out;
        }
      } else {
        return out;
      }
    }
    var search = function(options, callback){
      // See if we can find a municipality in the database
      // No municipality found? Try nominatim!
      options.featuretype = "settlement";
      nominatim.search(options, function (err, res, data) {
        var result;
        if(data.error){
          err = new Error(data.error);
        } else {
          result = clean(data);
        }
        callback(err, result || null);
      });
    };

    var reverse = function(options, callback){
      // See if we can find a municipality in the database
      // No municipality found? Try nominatim!
      options.featuretype = "settlement";
      options.osm_type = "R";
      options.zoom = 10;
      nominatim.reverse(options, function (err, res, data) {
        var result;
        if(data.error){
          err = new Error(data.error);
        } else {
          result = clean(data);
        }
        callback(err, result || null);
      });
    };

    module.exports.getoperator = function(req, res, next) {
        var params = req.swagger.params.body.value;
        res.setHeader('content-type', 'application/json');
        if(params.q){
          search(params, function(err, data){
            if (err) next(err);
            res.end(JSON.stringify(data, null, 2));
          })
        } else if(params.lat && params.lon){
          reverse({lat: params.lat, lon: params.lon}, function(err, data){
            if (err) next(err);
            res.end(JSON.stringify(data, null, 2));
          })
        } else {
          next(new Error('Please add q= or a lat= and lon= to the get request'));
        }

        /*
        var req = queryOverpass('[out:json];rel(around:100000,57.7,11.9)[admin_level=8];out;', function(err, geojson) {
          if (err) {
            next(err);
          }
          res.setHeader('content-type', 'application/json');
          res.setHeader('charset', 'utf-8');
          console.log(geojson);
          res.end(JSON.stringify(geojson, null, 2));
        });
        */
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
