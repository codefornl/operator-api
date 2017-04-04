/*!
 * Service model
 */
(function() {
  'use strict';
  module.exports = function(sequelize, DataTypes) {
    var corporation = sequelize.define("corporation", {
      operator_id: DataTypes.STRING,
      name: DataTypes.STRING,
      external_id: DataTypes.STRING,
      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
    return corporation;
  };
}());
