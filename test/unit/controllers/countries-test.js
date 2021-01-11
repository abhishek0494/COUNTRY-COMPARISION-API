const app = require('../../../src/server.js');
const config = require('../../../src/config');
const request = require('supertest');
const sinon = require('sinon');
const axios=require('axios')
require('chai').should();

const countryHelper = require('../../../src/controllers/countries/countries.controller');
// console.log(countryHelper,countryHelper.getCountries)
const mockCountries = require('../../fixtures/data/mock-countries.json');
const assert = require('sinon/lib/sinon/assert');

describe('countries endpoint tests', () => {
  let sandbox;
  beforeEach(function beforeEach() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function afterEach() {
    sandbox.restore();
  });

  describe('get countries', function getCountries() {
    const endpointUrl = config.routes.controllerRootUrl + '/v1/countries';

    it('should return a list of countries', function handleGettingCountries(done) {
      sandbox.stub(axios, 'get').returns(Promise.resolve({data:{countries:mockCountries}}
      ));
      
      request(app)
      .get(`${endpointUrl}`)
      .set('accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.body.should.be.an.array;
        res.body.should.eql(mockCountries);
        return done();
      });
    });

    it('should return empty array if no countries found', function handleNoCountriesFound(done) {
      sandbox.stub(axios, 'get').returns(Promise.resolve({data:{countries:[]}
      }))
      request(app)
      .get(`${endpointUrl}`)
      .set('accept', 'application/json')
      .expect(200, [])
      .end(err => {
        if (err) {
          return done(err);
        }
        return done();
      });
    });

    it('should return 500 if error getting countries', function handleErrorGettingCountries(done) {
   
      sandbox.stub(axios, 'get').returns(new Error('fake error'))
      
      request(app)
      .get(`${endpointUrl}`)
      .set('accept', 'application/json')
      .expect(500)
      .end(err => {
        if (err) {
            return done(err);
        }
        return done();
      });
      
    });
  });
});
describe('population endpoint tests', () => {
  let sandbox;
  beforeEach(function beforeEach() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function afterEach() {
    sandbox.restore();
  });

  describe('get countries population', function getCountriesPopulation() {
    const endpointUrl = config.routes.controllerRootUrl + '/v1/countries/population';

    it('should return a list of countries and its population', function handleGettingCountriesPopulation(done) {
      sandbox.stub(Promise, 'all').returns(Promise.resolve([{data:{"total_population": {"date": "2021-01-11", "population": 216796325}}
      },{data:""}]));
      
      request(app)
      .get(`${endpointUrl}?countries=Brazil,razil`)
      .set('accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.body.should.be.an.array;
        res.body.should.eql([{
          "date": "2021-01-11",
          "population": 216796325,
          "country": "Brazil"
      }]);
        return done();
      });
    });

    it('should return empty array if no countries found', function handleNoCountriesFound(done) {
      sandbox.stub(Promise, 'all').returns(Promise.resolve([{data:""}]))
      request(app)
      .get(`${endpointUrl}`)
      .send({query:{
        countries:''
      }})
      .set('accept', 'application/json')
      .expect(200, [])
      .end(err => {
        if (err) {
          return done(err);
        }
        return done();
      });
    });

    it('should return a list of countries and its population in ascending order', function handleGettingCountriesPopulation(done) {
      sandbox.stub(Promise, 'all').returns(Promise.resolve([{data:{"total_population": {"date": "2021-01-11", "population": 216796325}}
      },{data:{"total_population": {"date": "2021-01-11", "population": 21679632}}}]));
      
      request(app)
      .get(`${endpointUrl}?countries=Brazil,Mexico&sortOrder=asc`)
      .set('accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.body.should.be.an.array;
        res.body.should.eql([{
          "date": "2021-01-11",
          "population": 21679632,
          "country": "Mexico"
      },{
          "date": "2021-01-11",
          "population": 216796325,
          "country": "Brazil"
      }]);
        return done();
      });
    });

    it('should return a list of countries and its population in descending order', function handleGettingCountriesPopulation(done) {
      sandbox.stub(Promise, 'all').returns(Promise.resolve([{data:{"total_population": {"date": "2021-01-11", "population": 216796325}}
      },{data:{"total_population": {"date": "2021-01-11", "population": 21679632}}}]));
      
      request(app)
      .get(`${endpointUrl}?countries=Brazil,Mexico&sortOrder=desc`)
      .set('accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.body.should.be.an.array;
        res.body.should.eql([{
          "date": "2021-01-11",
          "population": 216796325,
          "country": "Brazil"
      },{
          "date": "2021-01-11",
          "population": 21679632,
          "country": "Mexico"
      }]);
        return done();
      });
    });

    it('should return 500 if error getting countries population',function handleErrorGettingCountries(done) {
   
      sandbox.stub(Promise, 'all').returns(Promise.reject(new Error('fake error')).catch(err=>{}))

      request(app)
      .get(`${endpointUrl}?countries=Brazil,Mexico&sortOrder=desc`)
      .set('accept', 'application/json')
      .expect(500)
      .end(err => {
        if (err) {
          return done(err);
        }
        return done();
      });
      
    });
  });
});