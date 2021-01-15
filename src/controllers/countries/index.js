'use strict';

const controller = require('./countries.controller');

function routes(app, rootUrl) {
  console.log(rootUrl)
  // include api version number
  let fullRootUrl = rootUrl + '/v1';

  /**
    * @apiVersion 1.0.0
    * @api {get} /countries
    * @apiGroup Countries
    * @apiName Get list of all countries
    * @apiDescription Returns an array of country names
    *
    * @apiSampleRequest /api/v1/countries
    *
    * @apiSuccess {json} Array of all country names
    * @apiSuccessExample {json} Success-Response:
    *   HTTP/1.1 200 OK
    *   [
    *     "Afghanistan",
    *     "AFRICA",
    *     "Albania",
    *     ...
    *   ]
    *
    * @apiError (Error 500) InternalServerError Returned if there was a server error
    */
  app.get({ url: fullRootUrl + '/countries' },
    controller.getCountries);
    /**
    * @apiVersion 1.0.0
    * @api {get} /countries/population
    * @apiGroup Countries
    * @apiName Get populations for the given set of countries
    * @apiDescription Returns an array of object with country name,population and date 
    * for the given set of countries separated by ","
    * 
    *
    * @apiSampleRequest /api/v1/countries/population?countries=Brazil,Mexico&sortOrder=asc
    *
    * @apiSuccess {json} Array of all country names
    * @apiSuccessExample {json} Success-Response:
    *   HTTP/1.1 200 OK
    *   [
    *     {
    *                 "date": "2021-01-10",
    *                 "population": 21692238,
    *                 "country": "Brazil"
    *       },
    *       {
    *                 "date": "2021-01-10",
    *                 "population": 216792238,
    *                 "country": "Mexico"
    *       }
    *   ]
    *
    * @apiError (Error 500) InternalServerError Returned if there was a server error
    */
  app.get({ url: fullRootUrl + '/countries/population' },
    controller.getCountriesPopulation);
}

module.exports = {
  routes: routes
};
