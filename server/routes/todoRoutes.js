// route handling for all routs dealing directly with the todos

// require express
const express = require('express');

// initialize an express router
const router = express.Router();


// create a get handler to the path /todos that sends back the todos
router.get('/todos', (req, res) => {
	// send back todos in json format
	res.json(todos);
	console.log(`GET /todos`);
});

// create a post handle to the path /todos that is used for adding a new todo to the array
router.post('/todos', (req, res) => {
	// create new todo object from the req and store in variable newTodo
	// be sure to add and id
	const newTodo = { id: Date.now(), ...req.body };
	// add newTodo to the todos array
	todos.push(newTodo);
	console.log(`POST /todos`);
	// send back a 201 status code along with newTodo in json format
	res.status(201).json(newTodo);
});
//exporting the router to be used in main
module.exports = router;