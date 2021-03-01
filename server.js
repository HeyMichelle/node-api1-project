const express = require("express");
const server = express();
const port = 8080;

// Step 2: import local file for database
const db = require("./database");

// Step 8: import shortid or custom-id for creating user post requests
const shortid = require("shortid");

// Step 4: create a new express server and add middleware to parse json reqs
server.use(express.json()); // need this to use req.body
// STRETCH: server.use(cors())

// Step 5: response for if someone hits this API, equiv. to home page
server.get("/", (req, res) => {
  res.json({ message: "Intro to Node.js and Express Server" });
  // res.send('Welcome to API Project One')
});

// Step 6: Getting response for list of users from "fake" databse
server.get("/api/users", (req, res) => {
  // gets a list of users from he "fake" database
  const users = db.getUsers();
  // can also do the above with: const users = req.body;

  if (users) {
    res.status(201).json(users); // correctly working, send users as json response
  } else {
    res
      .status(500)
      .json({ errorMessage: "The user's information could not be retrieved." });
  }
});

// Step 7: Getting process and error response for getting a user by id
server.get("/api/users/:id", (req, res) => {
  // the param variable matches up to the name of our URL param above
  const { id } = req.params;

  // get a specific user by their ID from the "fake" database
  const users = db.getUsers();
  // can also be written: const user = req.body;
  // shorten and combine: can also be written as: const users = db.getUserById(id);

  if (!users) {
    res
      .status(500)
      .json({ errorMessage: "The user's information could not be retrieved." });
      return;
  }

  const foundById = users.find((user) => user.id === id);

  if (!foundById) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else { 
      res.status(200).json(foundById)
    }
  // make sure the system doesn't break if someone calls the endpoint with
  // a user ID that doesn't exist in the database
});

// Step 8: npm i shortid, so that you can use shortid.generate() to make id for user post
// Step 9: Posting process and error response for posting to user api
server.post("/api/users", (req, res) => {
  // creates a new user in our "fake" database and returns the new user data
  const newUser = db.createUser({ id: shortid.generate(), ...req.body });
  // req.body meaning body of the object/data in the object. Could be name and bio both. to access specifically you would do req.body.name or req.body.bio
  // bio: req.body.bio,  // String, required

  if (!newUser.name || !newUser.bio) {
    res.status(400).json({
      errorMessage: "Please provide a name and a bio for the new user",
    })
    return;
  }

  if (newUser) {
    res.status(201).json(newUser);
  } else {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database",
    });
  }
});

// Step 10: Deleting process and error response for deleting user by ID
server.delete("/api/users/:id", (req, res) => {
  const userById = db.getUserById(req.params.id);

  // Step 10a: make sure the user exists before we try to delete it
  if (userById) {
    try {
      db.deleteUser(req.params.id);
      res.status(204).end();
    } catch {
      res.status(500).json({
        errorMessage: "The user could not be removed",
      });
    }
  } else {
    res.status(404).json({
      message: "The user with the specified ID does not exist.",
    });
  }
});

// if not using the dummy data/shortcuts then the expanded version would appear like below.

// server.delete('/api/users/:id', (req, res) => {
//     const { id } = req.params;
//     const found = users.find(user => user.id === id);

//     if (found) {
//       users = users.filter(user => user.id !== id)
//       res.status(200).json(users)
//     } else {
//       res.status(500).json({ errorMessage: "The user could not be removed" })
//     }

//     if (!found) {
//       res.status(404).json({ message: "The user with the specified ID does not exist" })
//     }
//   })

//Step 11: Put/Updating using put process and error response for editing method by user id
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  if (!changes) {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be modified." });
      return;
  }

  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
      return; // return will end the function, whereas .end() sends a final response to client
  }

  const currentUser = users.find((user) => user.id === id);

  if (currentUser) {
     const modifiedUser = { ...currentUser, ...changes, id };
     const updatedUser = updateUser(id, modifiedUser);
     res.status(200).json(updatedUser);
  } else {
      res.status(404).json({ errorMessage: "User could not be found by that ID."})
  }
});


server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
