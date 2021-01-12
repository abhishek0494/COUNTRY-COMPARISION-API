
<img src="atom.png"  width="200" height="60">

## Country Comparison API

### What is this?

The Country Comparison API will use data from a 3rd party provider, [api.population.io](http://api.population.io)<sup>[1](#footnote1)</sup>, to provide comparisons on population statistics.  Your colleague Joe Coder started the implementation (in Node.js v10 using restify), and now it's your turn to bring it to the next level.  

Our current stack is primarily built in Node.js, Golang, and .NET.  Since this service is just getting off the ground, if you'd rather implement this in a different language, feel free to do so.

### Setup

1. Download the repo
2. Run `npm install` to install dependencies
3. Run `npm test` to run unit tests
4. Set your NODE_ENV to `dev`
5. Run `npm start` to start the server

### Requirements

Joe created one endpoint that retrieves a list of country names, using mock data.

1. Update the endpoint to pull country data from http://api.population.io/1.0/countries.
2. The endpoint http://api.population.io/1.0/population/:country/:date returns the total population for a given country on a given date.  Design and implement an endpoint in our API that will allow a consumer to specify an arbitrary set of countries and an optional sort order, and receive back a list of countries and their population based on the current date.  If a sort order was specified, return the list sorted on population size, according to the consumer's requested sort order.

Try to be consistent with Joe's implementation in terms of:
* unit tests
* documentation
* error handling
* response codes
* validation
* etc.

Zip your solution, upload it somewhere, and send us a link to the zipped file.

### Bonus
1. Some scenarios to consider (leave your thoughts inline in your code or edit the README):
  * **How efficient is your code?  What are some ways that you could improve performance?**
				  * We can add pagination for api's with large payloads.
				  * We can add caching to reduce api calls for same urls. we can 	update caching data periodically or forcefully when any data is updated. 
  * **Suppose we expect this API to be hit 1000s of times a second.  How can we handle the load?**
				  * we can handle the load by distributing the load, we can make use of nodejs cluster mode in a multicore server which spawns new process, one for each core that runs simultaneously connected to a single master process thus behaving like a big multi-threaded node server.
				  * The other way i can think is using auto-scaling where the server scales up during peak time and scales down during normal hours by deploying the docker image on kubernetes.
  * **What if the 3rd party provider is not available?  How resilient is our API?**
				  * We can continuously monitor the third party api.
				  * We can add steps to handle rate limit reached. once the rate limit is reached we can make use of any messaging queue to publish all incoming requests and then respond to those requests after some time.
				  * We can add code to retry the request to the third party api with some retry limit to handle requests which failed due to some network issue.
				  * We can keep respond to request from cache memory until the api is available again.
				  * we can keep a fallback api to request when the other 3rd party api is not available.
  * **What if the requirement for the new endpoint was to also allow the consumer to compare populations for any given date.  How would you modify your implementation?**
				  * I will look for date in query string if date is available i will send that date given by user in request otherwise i will send the current date.
  * **What if we have a database of users and we wanted to make our API smarter by defaulting comparisons to always include the population of the current user's country.  How could we accomplish this?**
				  * We can add user information to req object in a middleware then in the api routes callback function we can check if the countryList has user's country in it or not and if its not there we can push users country in the list before sending the request to the third party.
  * **What if we wanted to keep a tally of the most frequently requested countries and have this be available to consumers.  How could we accomplish this?**
			  * we can maintain an object in db `{country1:count,country2:count....countryn:count}` and we keep updating the count for the country at every request and we can get the most frequently requested countries from the count. and we can make it available to customers through an api.
2. **Dockerize the API**

[Link to docker image](https://hub.docker.com/r/abhishek0494/country-comparision-api)
<br>
<i><a name="footnote1"><sup>1</sup></a> Joe says that api.population.io is down, so try https://d6wn6bmjj722w.population.io/ as the host instead.<i>
