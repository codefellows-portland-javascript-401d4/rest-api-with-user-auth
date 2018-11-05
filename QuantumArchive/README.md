# REST API with User Auth for Anime DB

A RESTful API that utilizes authorization to and tokens for DB access and modification

### Author

[Chris Bruner](https://github.com/QuantumArchive)

#### Version V1.0.0

Fully RESTful API that requires User Authentication in order to Access Anime Shows and Characters 
    
* Server uses Express for all API routes
* Backend uses Mongoose as a framework to interact with a Mongo database hosted by [mlab](mlab.com) for persistence
* To use the databases, you must get an authorization token and set that in your headers before being allowed to retrieve data (e.g. "Authorization":"Bearer token")
* Only admin/super user level may be able to access the anime shows collections
* Deleting a user from the database will require admin level priveleges

#### Express Routes

All routes are kept in the routes folder in a separate file

#### API endpoints

##### Authorization
To gain an authorization token, you must first use the following API endpoints:

* site:/users/signup - if you do not already have an account
* site:/users/signin - if you have an account already

The token will be given when a JSON object is sent formatted as such:

```javascript
{
    "username": "hello"
    "password": "world"
    "role": ["user"]
}
```

##### Anime DB
There are 2 API endpoints for collecting data that will take *Get*, *Put*, *Post* and *Delete* requests

* site:/animechars
* site:/animeshows

Anime shows will require admin or super user level priveleges in order to access information from within

* To get a specific character, you must add the id of the given resource to the query string (e.g. site:/animechars/:id) 
* To populate the 'shows' field in the anime chars database, a user with admin priveleges must make a PUT request to /animeshows/:showid/character/:characterid

#### Testing End-to-End

* Comprehensive testing is included that also verifies user authentication
* Tests use GET, PUT, POST and DELETE methods with different permissions levels

#### Issues

Feel free to send any issues to https://github.com/QuantumArchive


