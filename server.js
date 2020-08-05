
// PUT	/api/users/:id	

// {
//     id: "a_unique_id", // hint: use the shortid npm package to generate it
//     name: "Jane Doe", // String, required
//     bio: "Not Tarzan's Wife, another Jane",  // String, required
//   }

// Step 1: import dependency from node_module (express) using require()
const express = require("express")

// Step 2: import local file for database
const db = require("./database")

// Step 8: import shortid or custom-id for creating user post requests
const shortid = require("shortid")

// Step 4: create a new express server and add middleware to parse json reqs
const server = express()
server.use(express.json())

// Step 5: response for if someone hits this API, equiv. to home page
server.get("/", (req, res) => {
	res.json({ message: "Intro to Node.js" })
})

// Step 6: Getting response for list of users from "fake" databse
server.get("/users", (req, res) => {
	// gets a list of users from he "fake" database
	const users = db.getUsers()
    res.json(users)
    res.status(200).json(users)
})

// Step 7: Getting process and error response for getting a user by id
server.get("/users/:id", (req, res) => {
	// the param variable matches up to the name of our URL param above
	const id = req.params.id
	// get a specific user by their ID from the "fake" database
	const user = db.getUserById(id)

	// make sure the system doesn't break if someone calls the endpoint with
	// a user ID that doesn't exist in the database
	if (user) {
		res.json(user)
	} else {
		res.status(404).json({ message: "User not found" })
	}
})

// Step 8: npm i shortid, so that you can use shortid.generate() to make id for user post
// Step 9: Posting process and error response for posting to user api
server.post("/users", (req, res) => {
	// creates a new user in our "fake" database and returns the new user data
	const newUser = db.createUser({
		id: shortid.generate(),
		name: "Jane Doe", // String, required
		bio: "Not Tarzan's Wife, another Jane",  // String, required
	})
	res.status(201).json(newUser)
})

// Step 10: Deleting process and error response for deleting user by ID
server.delete("/users/:id", (req, res) => {
	const user = db.getUserById(req.params.id)

	// Step 10a: make sure the user exists before we try to delete it
	if (user) {
		db.deleteUser(req.params.id)
		res.status(204).end()
		// since we have nothing to return back to the client, send a 204 with an empty response.
		// 204 just means "success but we have nothing to return".
	} else {
		res.status(404).json({
			message: "User not found",
		})
	}
})

// Step 3: to start, use node server.js in terminal
server.listen(8080, () => {
    console.log("Server started on port 8080")
}) 



