import asyncHandler from 'express-async-handler'
import handleAssignment from './handleAssignment.js'
import handleDeleteLabel from './handleDeleteLabel.js'
import handleNewLabel from './handleNewLabel.js'
import handleNewIssue from './handleNewIssue.js'
import handleNewStatus from './handleNewStatus.js'

const handleGitHubEvents = asyncHandler(async (request, response) => {
  // Respond to indicate that the delivery was successfully received.
  // Your server should respond with a 2XX response within 10 seconds of 
  // receiving a webhook delivery. If your server takes longer than that to 
  // respond, then GitHub terminates the connection and considers the delivery 
  // a failure.
  response.status(202).send('Accepted')

  // Check the `x-github-event` header to learn what event type was sent.
  const githubEvent = request.headers['x-github-event']
  console.log(`Incoming githubEvent: ${ githubEvent }`)

  // Look for specific GitHub events to process.
  if (githubEvent === 'issues') {
    const body = JSON.parse(request.body.payload)
    const action = body.action
    console.log(`handleGitHubEvents - action: ${ action }`)

    const ghEvents = [
      { name: `assigned`, handler: handleAssignment, parms: [ action, body.issue.number, body ] },
      { name: `unassigned`, handler: handleAssignment, parms: [ action, body.issue.number, body ] },
      { name: `opened`, handler: handleNewIssue, parms: [ body ] },
      { name: `labeled`, handler: handleNewLabel, parms: [ body.issue.number, body] },
      { name: `unlabeled`, handler: handleDeleteLabel, parms: [ body.issue.number, body] },
      { name: `closed`, handler: handleNewStatus, parms: [ body.issue.number, body] },
    ]

    const event = ghEvents.find((entry) => entry.name === action)
    if (event !== undefined) {
      event.handler(event.parms)
    } else {
      console.log(`No event handler for the issue event: ${ action }`)
    }
  } else if (githubEvent === 'ping') {
    console.log('GitHub sent the ping event')
  } else {
    console.log(`Unhandled event: ${githubEvent}`)
  }

})

export { handleGitHubEvents }
