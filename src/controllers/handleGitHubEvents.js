import asyncHandler from 'express-async-handler'
import { handleNewIssue } from './handleNewIssue.js'

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
  if (githubEvent === 'issues' || githubEvent === 'issue_comment') {
    const body = JSON.parse(request.body.payload)
    const action = body.action
    console.log(`handleGitHubEvents - action: ${ action }`)
    switch (action) {
      case 'opened':
        const newIssueResult = await handleNewIssue(action, body)
        break
      case 'issue_comment':
        console.log(`Issue (${ body.issue.title } / ${ body.issue.number }) has been edited. body.issue.labels: `, body.issue.labels)
        
        if (body.issue.labels.find(label => label.name === 'Add to Clickup')) {
          const newIssueResult = await handleNewIssue(action, body)
        }
        
        break
      case 'assigned':
        console.log(`A user was assigned to an issue ${ body.issue.assignee.login }`)
        break
      case 'labeled':
        console.log(`A label was assigned to an issue`, body.issue.labels)
        break
      case 'closed':
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
