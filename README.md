This is a simple express persistent file api that uses mongodb to store data.

Content: 
This database contains pacific northwest trees of the two main types, gymnosperms(non-flowering trees) and angiosperms(true flowering trees), as well as animals (carnivores, omnivores, and herbivores);

Authorization:
    Signup for a token at                                       Url: 'localhost:3200/api/signup'
    Log in at                                                   Url: 'localhost:3200/api/login'
    (optional) validate a token at                              Url: 'localhost:3200/api/login/validate'

Access:  when using your token, you do NOT need to write 'Bearer'.
    All users:              All users can access all the endpoints in the trees resource.
    Admin:                  Only users with an 'Admin' role can access the endpoints in the animals resource.

Directions:
send all requests to the following fields:
  Url: 'localhost:3200/api/trees' or 'localhost:3200/api/trees/gymnosperms' or 'localhost:3000/api/trees/angiosperms'
  Url: 'localhost:3200/api/animals' or 'localhost:3200/api/animals/carnivores' or 'localhost:3000/api/animals/omnivores'

GET: see a list of entries
    All trees in the database:                   Url: 'localhost:3200/api/trees'
    All gymnosperms in the database:             Url: 'localhost:3200/api/trees/gymnosperms'
    All angiosperms in the database:             Url: 'localhost:3200/api/trees/angiosperms'
    All animals in the database:                 Url: 'localhost:3200/api/animals'
    All carnivores in the database:              Url: 'localhost:3200/api/animals/carnivores'

GET by genus:
    type genus after tree or animal and then add the specific genus as the next url parameter.
    example  Url: 'localhost:3200/api/trees/genus/Acer' gives all maples
    example Url: 'localhost:3200/api/animals/genus/Ursus' gives all bears

POST: add a tree to the database
    You can add a tree to the trees database and the program will sort it automatically 
   Example: {name: 'douglas fir', type: 'gymnosperm', genus: 'Pseudotsuga'}                 
   Post Url: 'localhost:3200/api/trees'

PUT: update an entry by id.

DELETE: a tree or animal by id


Querying:
      You can add a query at anytime by typing your query in this format added to your url "/?key=value"
      exmaple 'localhost:3200/api/trees/?name=Bigleaf+Maple' gives you the bigleaf maple tree.

