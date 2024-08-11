import express from 'express'
import bodyParser from 'body-parser'
import restRoutes from './routes/routes.js'

// Initialize a new Express application.
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', restRoutes)

// Start the server and listen at the specified port.
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on port ${ port }`)
})
