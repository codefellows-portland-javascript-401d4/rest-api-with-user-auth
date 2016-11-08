This app uses Express, MongoDB and Mongoose to keep track of music albums and artists. 
It utilizes RESTful verbs to retrieve, add, edit and remove entries for records and artists. 
The /records resource requires authorization. Upon signing up via the /api/auth/signup route, a JWT is issued.
Passwords are hashed via bcryptjs.
To sign in, access /api/auth/signin with the entry 'Authorization: Bearer + (validtoken)' in the headers.
Send a POST or PUT request to /api/records or /api/artists to create or edit resources for those respective routes.
Send a GET request to /api/records/ or /api/artists to retrieve all respective resources. 
Send a GET/:id request with the appropriate id to /api/records/ or /api/artists to retrieve a specific resource. 
Add the artistId from the appropriate 'artist' resource to a 'record' resource, and that artist name will populate in your 'record' resource.
