(function() {
  'use strict';
  module.exports = function(sequelize, DataTypes) {
    var catalog = sequelize.define("catalog", {
      catalog_id: DataTypes.STRING, //optional external id
      name: {type: DataTypes.STRING, unique: true}, //table name
      level: DataTypes.INTEGER, // The level in the sequence of return values this table should take.
      categories: DataTypes.ARRAY(DataTypes.STRING) //Report catagories this table holds jurisdictions for.
    });
    return catalog;
  };
}());