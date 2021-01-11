'use strict';

const co = require('co');
const errors = require('restify-errors');
const axios = require('axios');
const getCountries = co.wrap(function* getCountries(req, res, next) {
  try{
    return axios.get('https://d6wn6bmjj722w.population.io/1.0/countries')
    .then(response=>{
      res.json(response.data.countries);
      return next()
    }).catch((err)=>{
       return next(new errors.InternalServerError(err, 'Server error retrieving countries.'));
    })
  }catch(err){
    return next(new errors.InternalServerError(err, 'Server error retrieving countries.'));
  }
  
});


const getCountriesPopulation = co.wrap(function* getCountriesPopulation(req, res, next) {
  let query=req.query,countryList=[]
  if(typeof query.countries=='string')
     countryList=query.countries.split(',').map(el=>el.trim())
  let date=new Date().toISOString().substr(0,10)
  let promiseList=[]
  if(countryList.length==0){
    res.json([])
    return next()
  }
  countryList.forEach(element => {
    promiseList.push(axios.get(`https://d6wn6bmjj722w.population.io/1.0/population/${element}/${date}/`))
  });
  return Promise.all(promiseList)
  .catch((err)=>{
    return next(new errors.InternalServerError(err, 'Server error retrieving countries.'));
 })
     .then(json => {
        json=json.map((el,i)=>{
          let temp={}
          if(el.data!=""){
            temp=el.data
            temp.total_population.country=countryList[i]
            temp=temp.total_population
            return temp
          }else{
            return null
          }
          
       })
       //  remove response for invalid country names
      json=json.filter(el=>el)
      if(query.sortOrder){
        if(query.sortOrder=='asc'){
          json=json.sort((a,b)=>a.population-b.population)
        }else{
          json=json.sort((a,b)=>b.population-a.population)
        }
      }
      res.json(json);
       return next()
     }).catch((err)=>{
        return next(new errors.InternalServerError(err, 'Server error retrieving countries.'));
     })
});
module.exports={
  getCountries:getCountries,
  getCountriesPopulation:getCountriesPopulation
}
