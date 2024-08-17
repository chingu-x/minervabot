<<<<<<< HEAD

// Gracefully terminate when the server is shutdown or terminated
const shutdown = (server, connections) => {
  console.log('Received kill signal, shutting down gracefully')

=======
import deleteClickupWebhook from './deleteClickupWebhook.js'

// Gracefully terminate when the server is shutdown or terminated
const shutdown = (server, connections, clickUpWebhookID) => {
  console.log('Received kill signal, shutting down gracefully')

  if (clickUpWebhookID) {
    console.log(`Terminating Clickup Webhook: ${ clickUpWebhookID }`)
    deleteClickupWebhook(clickUpWebhookID)
  }

>>>>>>> ce36b261dd3b2b6ac0f09981c7e72d2fc183d36c
  server.close(() => {
      console.log('Closed out remaining connections')
      process.exit(0)
  });

  setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down')
      process.exit(1)
  }, 10000)

  connections.forEach(connection => connection.end())
  setTimeout(() => connections.forEach(
    connection => connection.destroy())
  , 5000)
}

export default shutdown