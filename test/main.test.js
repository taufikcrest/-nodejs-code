process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const request = require('request');
const port = process.env.PORT;
let token = "";
let userId = "";

chai.use(chaiHttp);

  describe('Render Main Page using Chai', () => {
    it('it should return Welcome to CrestInfoSystems', (done) => {
      chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
      
    it('Main page content - It fails when server is not running', function(done) {
      request(`http://localhost:${port}` , function(error, response, body) {
        chai.expect(response).to.have.status(200);
        done();
      });
    });
  });
  
  describe('User API Routes', function() {
    // This function will run before every test to get access token
    beforeEach(function(done) {
      chai.request(app)
      .post(`/api/auth/login`)
      .send({
        "email": "admin@example.com",
        "password": "password"
      })
      .end((err, res) => {
        res.should.have.status(200);
        token = res.body.token;
        done();
      });
    });

    // This function will run after every test to logged out
    afterEach(function(done) {
      chai.request(app)
      .get(`/api/auth/logout`)
      .end((err, res) => {
        res.should.have.status(200);
        token = "";
        done();
      });
    });

    // In this test it's expected a list of users
    describe('GET /api/admin/users', function() {
      it('returns a list of Users', function(done) {
        chai.request(app)
        .get(`/api/admin/users`)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
      });
    });

    // Testing the save user expecting status 200 of success
    describe('POST /api/admin/user', function() {
      it('saves a new user', function(done) {
        chai.request(app)
        .post(`/api/admin/user`)
        .auth(token, { type: 'bearer' })
        .send({
          "firstName": "Demo",
          "lastName": "User",
          "password": "password",
          "email": "demo@user.com",
          "phoneNumber": "917777766666"
        })
        .end((err, res) => {
          res.should.have.status(200);
          userId = res.body.data._id;
          done();
        });
      });
    });

    // Here it'll be tested two behaviors when try to find a user by id
    describe('GET /api/admin/user/:userId', function() {
      it('return a user details by id', function(done) {
        chai.request(app)
        .get(`/api/admin/user/${userId}`)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
      });

      it('return a empty array in data by fake id', function(done) {
        chai.request(app)
        .get(`/api/admin/user/6134ad1bba7159840a0e642d`)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(200);
          chai.expect(res.body.data).to.eql([])
          done();
        });
      });
    });

    // Testing the update user expecting status 200 of success
    describe('PUT /api/admin/user/:userId', function() {
      it('update a user', function(done) {
        chai.request(app)
        .put(`/api/admin/user/${userId}`)
        .auth(token, { type: 'bearer' })
        .send({
          "firstName": "Demo1",
          "lastName": "User1"
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
      });
    });

    // Testing how to delete a user expecting status 200 of success
    describe('DELETE /api/admin/user/:userId', function() {
      it('removes a user', function(done) {
        chai.request(app)
        .delete(`/api/admin/user/${userId}`)
        .auth(token, { type: 'bearer' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
      });
    });
  });