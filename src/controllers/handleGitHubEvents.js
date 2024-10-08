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

    /*
    switch (action) {
      case 'assigned':
        // When someone is assigned to the GitHub issue also add them to the
        // associated Clickup Task
        const newAssignmentResult = await handleAssignment(action, body.issue.number, body)
        break
      case 'unassigned':
        // When someone is unassigned from the GitHub issue also remove them
        // from the associated Clickup Task 
        const removeAssignmentResult = await handleAssignment(action, body.issue.number, body)
        break
      case 'opened':
        const newIssueResult = await handleNewIssue(action, body)
        break
      case 'labeled':
        console.log(`Issue (${ body.issue.title } / ${ body.issue.number }) A label was assigned to an issue: `, body.issue.labels)
        
        // Clone the issue to Clickup as a task when the `Add to Clickup` label is added
        if (body.issue.labels.find(label => label.name === 'Add to Clickup')) {
          const newIssueResult = await handleNewIssue(action, body)
        }

        // Process any team labels
        const isTeamLabel = body.label.name.startsWith('team/')
        if (isTeamLabel) {
          const taskTeam = body.label.name.slice(5) // Strip off the `team` prefix
          const teamAddResult = await handleNewLabel(body.issue.number, taskTeam)
          break
        } 

        // Process any status labels
        const isStatusLabel = body.label.name.startsWith('status/')
        if (isStatusLabel) {
          const taskStatus = body.label.name.slice(7) // Strip off the `status` prefix
          const statusAddResult = await handleNewStatus(body.issue.number, taskStatus)
          break 
        } 

        // Process any priority labels
        const isPriorityLabel = body.label.name.startsWith('priority/')
        if (isPriorityLabel) {
          const taskPriority = body.label.name.slice(9) // Strip off the `status` prefix
          const priorityAddResult = await handleNewPriority(body.issue.number, taskPriority)
          if (priorityAddResult === undefined) {
            console.log(`handleGitHubEvents - priorityAddResult:${priorityAddResult} for issueNo:${body.issue.number} taskPriority:${taskPriority}`)
          }
          break 
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
        console.log(`An issue was closed by ${ body.issue.user.login }`)
        const statusAddResult = await handleNewStatus(body.issue.number, 'BUGFIX COMPLETED')
        break
      default:
        console.log(`Unhandled action for the issue event: ${ action }`)
    }
    */
  } else if (githubEvent === 'ping') {
    console.log('GitHub sent the ping event')
  } else {
    console.log(`Unhandled event: ${githubEvent}`)
  }

})

export { handleGitHubEvents }
