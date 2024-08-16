import deleteClickupWebhook from './deleteClickupWebhook.js'

// Gracefully terminate when the server is shutdown or terminated
const shutdown = (server, connections, clickUpWebhookID) => {
  console.log('Received kill signal, shutting down gracefully')

  // Delete the Clickup Webhook if it's active
  if (clickUpWebhookID) {
    console.log(`Terminating Clickup Webhook: ${ clickUpWebhookID }`)
    deleteClickupWebhook(clickUpWebhookID)
  }

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