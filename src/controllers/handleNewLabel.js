import fetch from 'node-fetch'
import getTaskID from '../util/getTaskID.js'
import handleNewPriority from './handleNewPriority.js'
import handleNewStatus from './handleNewStatus.js'

// When a new label is assigned to the issue add a cooresponding tag to the
// cooresponding ClickUp Task.
const assignLabel = async (githubIssueNo, labelName) => {
  console.log(`handleNewLabel - githubIssueNo:${ githubIssueNo } labelName:`, labelName)

  let taskID

  try {
    // Retrieve the associated ClickUp Task ID that was added as a comment to 
    // the GitHub Issue  
    taskID = await getTaskID(githubIssueNo) 
    if (taskID !== -1) {
      // Add the new label as a tag on the associated Clickup Task
      const query = new URLSearchParams({
        custom_task_ids: 'true',
        team_id: process.env.CLICKUP_TEAM_ID
      }).toString()
    
      const taskId = taskID
      const tagName = labelName
      const response = await fetch(
        `https://api.clickup.com/api/v2/task/${taskId}/tag/${tagName}?${query}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.CLICKUP_API_KEY
          }
        }
      )
    }
  }
  catch (error) {
    throw Error(`handleNewLabel - taskID:${taskID} githubIssueNo:${githubIssueNo} labelName:${labelName} error:`, error)
  }
  return
}

const handleNewLabel = async(parms) => {
  const [githubIssueNo, body] = parms

  // Clone the issue to Clickup as a task when the `Add to Clickup` label is added
  if (body.issue.labels.find(label => label.name === 'Add to Clickup')) {
    const newIssueResult = await assignLabel(action, body)
  }

  const isTeamLabel = body.label.name.startsWith('team/')
  const isStatusLabel = body.label.name.startsWith('status/')
  const isPriorityLabel = body.label.name.startsWith('priority/')

  // Process any team labels
  if (isTeamLabel) {
    const taskTeam = body.label.name.slice(5) // Strip off the `team` prefix
    const teamAddResult = await assignLabel(body.issue.number, taskTeam)
  } 

  // Process any status labels
  if (isStatusLabel) {
    const taskStatus = body.label.name.slice(7) // Strip off the `status` prefix
    const statusAddResult = await handleNewStatus([body.issue.number, taskStatus])
  } 

  // Process any priority labels
  if (isPriorityLabel) {
    const taskPriority = body.label.name.slice(9) // Strip off the `status` prefix
    const priorityAddResult = await handleNewPriority(body.issue.number, taskPriority)
    if (priorityAddResult === undefined) {
      console.log(`handleGitHubEvents - priorityAddResult:${priorityAddResult} for issueNo:${body.issue.number} taskPriority:${taskPriority}`)
    } 
  }

  // Process any other labels
  if (!isTeamLabel && !isStatusLabel && !isPriorityLabel) {
    const labelAddResult = await assignLabel(body.issue.number, body.label.name)
  }
}

export default handleNewLabel