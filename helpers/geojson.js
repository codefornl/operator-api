/**
 *
 * GeoJSON Schemas for Sequelize
 *
 * Based on GeoJSON Schemas for Mongoose
 *
 * rough GeoJSON schemas for use with mongoose schema creation
 *
 * Based on GeoJSON Spec @ http://geojson.org/geojson-spec.html
 *
 * Created by Ben Dalton (ben@rideamigos) on 3/27/14.
 * Copyright RideAmigos (http://rideamigos.com)
 **/

var crs = {};

function validateCrs(crs) {
  if (typeof crs !== 'object' && crs !== null) {
    throw new Error('Crs must be an object or null');
  }
  if (crs === null) {
    return;
  }
  if (!crs.type) {
    throw new Error('Crs must have a type');
  }
  if (crs.type !== 'name' && crs.type !== 'link') {
    throw new Error('Crs must be either a name or link');
  }
  if (!crs.properties) {
    throw new Error('Crs must contain a properties object');
  }
  if (crs.type === 'name' && !crs.properties.name) {
    throw new Error('Crs specified by name must have a name property');
  }
  if (crs.type === 'link' && !crs.properties.href || crs.type === 'link' && !crs.properties.type) {
    throw new Error('Crs specified by link must have a name and href property');
  }
}

function validatePoint(coordinates) {
  // must be an array (object)
  if (typeof coordinates !== 'object') {
    throw new Error('Point ' + coordinates + ' must be an array');
  }
  // must have 2/3 points
  if (coordinates.length < 2 || coordinates.length > 3) {
    throw new Error('Point' + coordinates + ' must contain two or three coordinates');
  }
  // must have two numbers
  if (typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') {
    throw new Error('Point must have two numbers');
  }
  if (!crs) {
    // longitude must be within bounds
    if (coordinates[0] > 180 || coordinates[0] < -180) {
      throw new Error('Point' + coordinates[0] + ' should be within the boundaries of longitude');
    }
    // latitude must be within bounds
    if (coordinates[1] > 90 || coordinates[1] < -90) {
      throw new Error('Point' + coordinates[1] + ' should be within the boundaries of latitude');
    }
  }
}

function validateMultiPoint(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePoint(coordinates[i]);
  }
}

function validateLineString(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePoint(coordinates[i]);
  }
}

function validateMultiLineString(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validateLineString(coordinates[i]);
  }
}

function arraysEqual(arr1, arr2) {
  if(arr1.length !== arr2.length) return false;
  for(var i = arr1.length; i--;) {
    if(arr1[i] !== arr2[i])
    return false;
  }
  return true;
}

function validatePolygon(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    // The LinearRing elements must have at least four Points
    if (coordinates[i].length < 4) {
      throw new Error('Each Polygon LinearRing must have at least four elements');
    }
    // the LinearRing objects must have identical start and end values
    if (!arraysEqual(coordinates[i][0], coordinates[i][coordinates[i].length-1])) {
      throw new Error('Each Polygon LinearRing must have an identical first and last point');
    }
    // otherwise the LinearRings must correspond to a LineString
    validateLineString(coordinates[i]);
  }
}

function validateMultiPolygon(coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    validatePolygon(coordinates[i]);
  }
}

function validateGeometry(geometry) {
  switch (geometry.type) {
    case 'Point':
    validatePoint(geometry.coordinates);
    break;
    case 'MultiPoint':
    validateMultiPoint(geometry.coordinates);
    break;
    case 'LineString':
    validateLineString(geometry.coordinates);
    break;
    case 'MultiLineString':
    validateMultiLineString(geometry.coordinates);
    break;
    case 'Polygon':
    validatePolygon(geometry.coordinates);
    break;
    case 'MultiPolygon':
    validateMultiPolygon(geometry.coordinates);
    break;
    default:
    throw new Error('Geometry must have a valid type');
  }
}

function validateGeometries(geometries) {
  for (var i = 0; i < geometries.length; i++) {
    validateGeometry(geometries[i]);
  }
}

function validateFeature(feature) {
  if (!feature.type) {
    throw new Error('Feature must have a type');
  }
  // type must be Feature
  if (feature.type !== 'Feature') {
    throw new Error(feature.type + ' is not a valid GeoJSON type');
  }
  if (!feature.geometry) {
    throw new Error('Feature must have a geometry');
  }
  // check for crs
  if (feature.crs) {
    crs = feature.crs;
    validateCrs(crs);
  }
  validateGeometry(feature.geometry);
}

function validateFeatureCollection(featurecollection) {
  if(!featurecollection.features){
    throw new Error('FeatureCollection contains no Features');
  }
  for (var i = 0; i < featurecollection.features.length; i++) {
    validateFeature(featurecollection.features[i]);
  }
  return featurecollection;
}

module.exports.validate = function(json){
  if (!json.type) {
    throw new Error('Feature must have a type');
  }
  // check for crs
  if (json.crs) {
    crs = json.crs;
    validateCrs(crs);
  }
  // type must be Feature or a FeatureCollection
  if (json.type === 'Feature') {
    return validateFeatureCollection(
      {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": [json]
      }
    );
  } else if (json.type === 'FeatureCollection') {
    return validateFeatureCollection(json);
  } else {
    throw new Error('JSON does not contain a Feature or FeatureCollection');
  }
};
