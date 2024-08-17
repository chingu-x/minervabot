import express from 'express'
import bodyParser from 'body-parser'
import restRoutes from './routes/routes.js'
<<<<<<< HEAD
import shutdown from './util/shutdown.js'

let connections = []
let server
const handleShutdown = () => shutdown(server, connections)
=======
import createClickupWebhook from './util/createClickupWebhook.js'
import shutdown from './util/shutdown.js'

let clickUpWebhookID
let connections = []
let server

const handleShutdown = () => shutdown(server, connections, clickUpWebhookID)
>>>>>>> ce36b261dd3b2b6ac0f09981c7e72d2fc183d36c

// Initialize a new Express application.
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

clickUpWebhookID = await createClickupWebhook()
app.use('/', restRoutes)

// Start the server and listen at the specified port.
const port = process.env.PORT || 3000
server = app.listen(port, () => {
  console.log(`Server is running on port ${ port }`)
})

server.on('connection', connection => {
<<<<<<< HEAD
  connections.push(connection)
  connection.on('close', () => connections = connections.filter(curr => curr !== connection))
=======
    connections.push(connection)
    connection.on('close', () => connections = connections.filter(curr => curr !== connection))
>>>>>>> ce36b261dd3b2b6ac0f09981c7e72d2fc183d36c
})

// Get control when the server is shutdown or terminated
process.on('SIGTERM', handleShutdown)
<<<<<<< HEAD
process.on('SIGINT', handleShutdown)
=======
process.on('SIGINT', handleShutdown)
>>>>>>> ce36b261dd3b2b6ac0f09981c7e72d2fc183d36c
