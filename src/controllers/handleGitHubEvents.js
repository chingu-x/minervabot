import asyncHandler from 'express-async-handler'
import handleDeleteLabel from './handleDeleteLabel.js'
import handleNewLabel from './handleNewLabel.js'
import handleNewIssue from './handleNewIssue.js'

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
    switch (action) {
      case 'opened':
        // When a new issue is added to GitHub clone it to a new Clickup Task
        const newIssueResult = await handleNewIssue(action, body)
        break
      case 'labeled':
        // When a label is added to a GitHub Issue clone it to the associated
        // Clickup Task 
        console.log(`Issue (${ body.issue.title } / ${ body.issue.number }) A label was assigned to an issue: `, body.label)
        
        // Clone the issue to Clickup as a task when the `Add to Clickup` label 
        // is added. 
        if (body.issue.labels.find(label => label.name === 'Add to Clickup')) {
          const newIssueResult = await handleNewIssue(action, body)
        }

        // Process any other labels
        const labelAddResult = await handleNewLabel(body.issue.number, body.label.name)

        break
      case 'unlabeled':
        // When a label is removed from a GitHub Issue also remove it from the
        // associated Clickup Task 
        console.log(`Issue (${ body.issue.title } / ${ body.issue.number }) A label was removed from an issue: `, body.issue.labels)
        const labelDeleteResult = await handleDeleteLabel(body.issue.number, body.label.name)
        break
      case 'closed':
        // Close the associated Clickup Task when the GitHub Issue is closed
        console.log(`An issue was closed by ${ body.issue.user.login }`)
        break
      default:
        console.log(`Unhandled action for the issue event: ${ action }`)
    }
  } else if (githubEvent === 'ping') {
    console.log('GitHub sent the ping event')
  } else {
    console.log(`Unhandled event: ${githubEvent}`)
  }

})

export { handleGitHubEvents }
