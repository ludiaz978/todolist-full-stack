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

const todoRoutes = require('./routes/todoRoutes');
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


//HTTP Handlers related to login
//mock get res for login page

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