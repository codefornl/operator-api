(function() {
  'use strict';
  var fs = require("fs");
  var Moniker = require('moniker');
  var GeoJSON = require('../helpers/geojson.js');
  var Sequelize = require("sequelize");
  var env = process.env.NODE_ENV || "development";
  var models = require('../models');
  var config;

  /**
   * Upload a geojson file into a table that will be used by the jurisdiction controller
   */

  module.exports.postupload = function(req, res, next) {
    res.setHeader('content-type', 'application/json');

    if(req.swagger.params.file){
      //filetype should be geojson or fail
      if(req.swagger.params.file.value.mimetype === 'application/geo+json'){
        var tmp = GeoJSON.validate(
          JSON.parse(
            req.swagger.params.file.value.buffer.toString()
          )
        );
        var tablename = req.swagger.params.table.value || Moniker.choose();
        var level =  req.swagger.params.level.value || 1;
        var categories =  req.swagger.params.categories.value || [];
        var catalog_id =  req.swagger.params.catalog_id.value || null;
        if (catalog_id) {
          catalog_id = catalog_id.toLowerCase();
        }
        if (!fs.existsSync(__dirname + '/../config/config.json')) {
          //check to see if config file exists, if not, default to config.default.json
          config = require(__dirname + '/../config/config.default.json')[env];
        } else {
          config = require(__dirname + '/../config/config.json')[env];
        }
        var sequelize = new Sequelize(config.database, config.username, config.password, config);

        //Create the required sequelize model:
        var tempmodel = sequelize.define('uploadModel', {
          name: Sequelize.STRING,
          external_id: Sequelize.STRING,
          the_geom: Sequelize.GEOMETRY('GEOMETRY',4326)
        }, {
          freezeTableName: true,
          tableName: tablename
        });
        var option = { force: false };
        if(req.swagger.params.action || req.swagger.params.action.value === "replace"){
          option = {force: true };
        }
        tempmodel.sync(option).then(function() {
          if (tmp.type === 'FeatureCollection'){
            //each features
            var inserts = [];
            for (var i = 0, len = tmp.features.length; i < len; i++) {
              var myGeom = tmp.features[i].geometry;
              myGeom.crs = { type: 'name', properties: { name: 'EPSG:4326'} };
              inserts.push({
                name: tmp.features[i].properties[req.swagger.params.name_column.value],
                the_geom: myGeom
              });
            }
            tempmodel.bulkCreate(inserts,{
              returning: true
            }).then(function(result) {
              // Insert meta information
              var catalog = {
                "catalog_id": null,
                "name": tablename,
                "level": level,
                "categories": categories,
                "catalog_id": catalog_id
              };
              models.catalog.sync().then(function(){
                models.catalog.findOne({ where: {name: tablename} }).then(function(result){
                  if (result) {
                    result.updateAttributes(catalog).then(function(){
                      res.end(JSON.stringify({"status":"ok"}, null, 2));
                    });
                  } else {
                    // Author does not exist...
                    models.catalog.create(catalog).then(function(result){
                      res.end(JSON.stringify({"status":"ok"}, null, 2));
                    });
                  }
                })
              });
            }).catch(function(err) {
              next(err);
            });
          } else {
            // Invalid GeoJSON
            next(new Error('No FeatureCollection, but we should not be here!'));
          }
        });

      } else {
        // Invalid File Type
        next(new Error('file object is not of type application/geo+json'));
      }
    } else {
      // No file object presented
      next(new Error('No file object found in request'));
    }
  };
}());
