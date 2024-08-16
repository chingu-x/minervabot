import express from 'express'
import bodyParser from 'body-parser'
import restRoutes from './routes/routes.js'
import shutdown from './util/shutdown.js'

let connections = []
let server
const handleShutdown = () => shutdown(server, connections)

// Initialize a new Express application.
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', restRoutes)

// Start the server and listen at the specified port.
const port = process.env.PORT || 3000
server = app.listen(port, () => {
  console.log(`Server is running on port ${ port }`)
})

server.on('connection', connection => {
  connections.push(connection)
  connection.on('close', () => connections = connections.filter(curr => curr !== connection))
})

// Get control when the server is shutdown or terminated
process.on('SIGTERM', handleShutdown)
process.on('SIGINT', handleShutdown)