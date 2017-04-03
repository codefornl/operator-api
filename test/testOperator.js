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
  describe('GET local government by coordinates', function() {
    it('it should return Vught', function(done) {
      chai.request(app)
        .get('/api/operator')
        .send({"lat": 51.6362, "lon": 5.2981})
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          should.equal(data.operator, 'Vught');
          should.equal(data.type, 'local government');
          should.equal(data.country, 'nl');
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('GET local government by coordinates', function() {
    it('it should return Eindhoven', function(done) {
      chai.request(app)
        .get('/api/operator')
        .send({"lat": 51.4547, "lon": 5.4212})
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          should.equal(data.operator, 'Eindhoven');
          should.equal(data.type, 'local government');
          should.equal(data.country, 'nl');
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('GET local government by address', function() {
    it('it should return Vught', function(done) {
      chai.request(app)
        .get('/api/operator')
        .send({"q": "beukenlaan 2 vught"})
        .set('x-access-token', token)
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          should.equal(data.operator, 'Vught');
          should.equal(data.type, 'local government');
          should.equal(data.country, 'nl');
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('GET local government by address', function() {
    it('it should return Rotterdam', function(done) {
      chai.request(app)
        .get('/api/operator')
        .send({"q": "Gouwstraat rotterdam"})
        .set('x-access-token', token)
        .end(function(err, res) {
          var data = JSON.parse(res.text);
          should.equal(data.operator, 'Rotterdam');
          should.equal(data.country, 'nl');
          res.should.have.status(200);
          done();
        });
    });
  });
});

describe('GET local government by coordinates', function() {
  it('it should return Eindhoven', function(done) {
    chai.request(app)
      .get('/api/operator')
      .send({"lat": 51.4202, "lon": 5.4976})
      .end(function(err, res) {
        var data = JSON.parse(res.text);
        should.equal(data.operator, 'Eindhoven');
        should.equal(data.type, 'local government');
        should.equal(data.country, 'nl');
        res.should.have.status(200);
        done();
      });
  });
});