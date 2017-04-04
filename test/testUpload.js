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

  describe('Post GeoJson File', function() {
    it('it should return ok', function(done) {
      chai.request(app)
        .post('/api/upload')
        .attach('file', fs.readFileSync('./assets/housingcorporations.geojson'), 'housingcorporations.geojson')
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          res.should.have.status(200);
          done();
        });
    });
  });
});
