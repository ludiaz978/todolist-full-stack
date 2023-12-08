//require express and cors and jsonwebtoken
const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');

//create the express
const app = express();
//set up middleware

//set up CORS middleware
app.use(cors());

//require and configure dotenv
require('dotenv').config()

//load and store our JWT secret key
const secretKey = process.env.JWT_SECRET;

//request logging middleware
app.use((req, res, next) => {
  //eample: req.method: get, post, put, delete, req.url: /api/users
  console.log(`${req.method} request to ${req.url}`);
  //next() is a function that we call to move on to the next middleware
  next();
});

//set up JSON parsing middlewar
app.use(express.json());


//implement middleware for JWT Authentication
// make function seperatley, and then pass to app.use
const autMiddleware =(req, res, next) => {
    //extract the token the "Authorization" header of the incoming request
    const token = req.headers['authorization'];
    //if so
    if (token) {
jwt.verify(token, secretKey, (err, decoded) => {
// if the token verification fails(invalid, expred, etc.)send a 403 (unauthorized) status
if (err) {
    return res.status(403).send("Unauthorized");
}
//if the token is valid, the 'decoded' parameter contains the payload of the JWT
//attach the decoded payload (user info) to the request object
//which allows for subsequent middleware or route handlers to also have access to the user info
req.user = decoded;
//call the next function in the middleware/route handler chain
//this passes control to the next middleware or route handler
next();
})
} else {
    //if no token provided in the headers, send a 403 "Unauthorized" response
    //this blocks the request from proceeding further if no token is present
  res.status(403).send("Unauthorized");
}
};
//protect route with autMiddleware by applying it to the /todos route
app.use('/todos', autMiddleware);


//creat local storage array for todos
let todos = [{ id: 1, task: "wash dishes" }];

//create local storage array for users
let users = [
    {id: 1, username: 'admin', password: 'password' },
    {id: 2, username: "bob sagit", password: "password1"}
];

//HTTP Handlers related to login
//mock get res for login page
app.get('/login', (req, res) => {
    res.send("Login Page");
})
//create post handler to handle authentication
app.post("/login", (req, res) => {
    //extract username and password from the request body
    const {username, password} = req.body;//assumes body will contain username and password

    //find a user in users array whose credentials match those sent in the request
    //Array.find()-> iterates through the array and runs each item through a function
    //that returnsa boolean. if the function returns true, then find stops and returns
    //the item it was on
    const user = users.find(u => u.username ===username && u.password === password);

    //check is a matching user was found
    if (user){
        //user is found, so create a JWT token
        //jwt.sign create a new jwt with the specified payload and secret key
        const token = jwt.sign(
            {userId: user.id}, //payload: contains user info, eg. user id
            secretKey, //the secret key used for signing the token
            { expiresIn: '1h'});//sets token expiration time to 1 hour

            //send the created token back in the response
            res.json({ token });
        } else {
            //no user was found so send back 401 unauthorized response
            res.status(401).send("Authentication Failed");
        }
})
//HTTP Handlers related to todo data
//create a get handler to the path /todos that sends back the todos
app.get("/todos", (req, res) => {
    //sends back todos in JSON format
  res.send(todos);
});

//create a post handler to the path /todos that adds a new todo and then returns all todos
app.post('/todos', (req, res) => {
    //create new todo object from the request and store in a variable
    //besure to add in an id
    const newTodo = { ...req.body, id: Date.now() };

    //add the new todo to the todos array
    todos = [...todos, newTodo];

    //send back a 210 status code along with the new todo
    res.status(201).send({ todo: newTodo });
    });
  

//define port 3001
const PORT = 3001;

//tell the app to listen at that port
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});