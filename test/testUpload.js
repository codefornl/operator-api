//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('moment-timezone');
var chai = require('chai');
var fs = require('fs');
var chaiHttp = require('chai-http');
var app = require('../server');
var models = require('../models');

chai.use(chaiHttp);
var should = chai.should();

describe('testing /api/upload', function() {

  afterEach(function() {
    // runs after each test in this block
  });

  describe('POST GeoJson File', function() {
    it('it should return ok', function(done) {
      chai.request(app)
        .post('/api/upload')
        .field("action", "replace")
        .field("table", "corporations_2017") //If not set, generate table name
        .field("catalog_id", "open311-ehv")
        .field("categories[]", "1")
        .field("categories[]", "2")
        .field("categories[]", "4")
        .field("categories[]", "5")
        .field("categories[]", "6")
        .field("level", 12) // Integer. The higher the integer, the closer to the ground. Can be used to set a hierarchy.
        .field("name_column", "WONINGCORP") //Should fail if not set
        .attach('file', fs.readFileSync('./assets/featurecollection.geojson'), 'featurecollection.geojson')
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('POST GeoJson File generate tablename', function() {
    it('it should return ok', function(done) {
      chai.request(app)
        .post('/api/upload')
        .field("action", "replace")
        .field("level", 14) // Integer. The higher the integer, the closer to the ground. Can be used to set a hierarchy.
        .field("name_column", "WONINGCORP") //Should fail if not set
        .field("catalog_id", "open311-ehv")
        .field("categories[]", "3")
        .attach('file', fs.readFileSync('./assets/feature.geojson'), 'feature.geojson')
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.have.status(200);
          done();
        });
    });
  });
});
