//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var moment = require('moment-timezone');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../server');
var models = require('../models');

chai.use(chaiHttp);
var should = chai.should();

describe('testing /api/operator', function() {
  var token = "myawesomedummytoken";

  var testoperator = {
    code: 'wueteria',
    name: 'Wüteria Mineralquellen GmbH & Co. KG',
    url: 'http://wueteria.de',
    country: 'Germany'
  };

  afterEach(function() {
    // runs after each test in this block
  });

  /*
   * Test the /POST Operator route
   */
  describe('GET Operator at coordinate', function() {
    it('it should return a list of operators with distance and type', function(done) {
      chai.request(app)
        .get('/api/operator')
        .end(function(err, res) {
          console.log(err);
          res.should.have.status(200);
          done();
        });
    });
  });

  /*
   * Test the /POST Operator route
   */
  describe('GET Operator by address', function() {
    it('it should return a list of operators with distance and type', function(done) {
      chai.request(app)
        .get('/api/operator')
        .set('x-access-token', token)
        .end(function(err, res) {
          res.should.have.status(200);
          done();
        });
    });
  });
});
