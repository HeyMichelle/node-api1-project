
// Step 1: import dependency from node_module (express) using require()
// const express = require("express")
const server = require('server.js')
const port = 8080;




// Step 3: to start , use node server.js in terminal
server.listen(port, () => {
    console.log(`Listening on port ${port}`)
}) 