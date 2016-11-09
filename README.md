## Overview

This is a single resource api with user auth done for the rest-api-with-user-auth assignment.

### Endpoints

#### Auth
Paths beginning with '/auth' are used for user authentication i.e. signing in, signing up, and token validation.

- '/auth/signup' is where you can sign up a new user with a valid JSON object containing a username and password. This user will be given  default permissions of 'user'. Currently the permissions do nothing

- '/auth/signin' is where an existing user can sign in using a valid JSON object containing their username and password.

-for both of these paths, the response from the api will be a token that can be used to access the cat api

- '/auth/validate' will respond with true when a post request is made with a valid jwt in the authorization header, and false if the token is invalid.

#### Cat api

Path beginning with '/cats' are used to access the data api. Note that you must have a valid jwt in the header authorization to access this api.

##### GET requests
- '/cats' will return all of the cats in data api
- '/cats/:id' will return the cat corresponding to the given id parameter

##### POST requests
- '/cats' will post a valid JSON object with properties 'name', 'age', and 'chill'. 'name' is required and must be a string, 'age' must be a number, and 'chill' is a boolean with a default value of false.

##### PUT requests
- '/cats/:id' will update the resource corresponding to the given id parameter, the JSON data passed in must match the schema given in the POST request instructions.

##### DELETE requests

- '/cats' will delete all of the resources
- '/cats/:id' will the delete the resource corresponding to the given id parameter 
