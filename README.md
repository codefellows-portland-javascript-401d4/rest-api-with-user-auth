This app enables you to store and retrieve information about artists.
In order to use the app, you first need to sign up and receive a token.
To sign up, send a POST request to localhost:3000/api/auth/signup with JSON containing
a username and password.

After you have signed up, you are able to send the following RESTful requests
using your token:

    Get a list of all artists- GET request to localhost:3000/api/artists

    Get info for a single artist- GET request to localhost:3000/api/artists/:id

    Get average number of shows for all artists- GET request to
    localhost:3000/api/artists/averageShows

    Post an artist- POST request to localhost:3000/api/artists with JSON
    containing name(string; required), type(string; default:visual), genre(string;
    default:pop), shows(number; default:0)

    Change the information for an artist- PUT request to localhost:3000/api/artists/:id
    following same format as POST request

In order to delete information for an artist, you need to be an administrator. If you have 
recently been given administrator privileges, you will need to sign in again at
localhost:3000/api/auth/signin in order to recieve a new token.
