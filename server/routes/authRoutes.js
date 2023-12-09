//route handling for login route
const express = require('express');
// initialize an express router
const router = express.Router();
//create local storage array for users
let users = [
    {id: 1, username: 'luradiaz', password: "password1" },
    {id: 2, username: "johndoe", password: "password2"}
];

router.get('/login', (req, res) => {
    res.send("Login Page");
})

router.post("/login", (req, res) => {
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
        module.export = router;