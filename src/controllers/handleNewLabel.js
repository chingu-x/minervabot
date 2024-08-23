import fetch from 'node-fetch'
import { Octokit } from 'octokit'
import getTaskID from '../util/getTaskID.js'

// When a new label is assigned to the issue add a cooresponding tag to the
// cooresponding ClickUp Task.
const handleNewLabel = async (githubIssueNo, labelName) => {
  console.log(`handleLabelChanges - githubIssueNo:${ githubIssueNo } labelName:`, labelName)

  let taskID

  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })
    
    // Retrieve the associated ClickUp Task ID that was added as a comment to 
    // the GitHub Issue  
    const taskID = await getTaskID(githubIssueNo)  
    
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
  catch (error) {
    throw Error(`connectIssueToClickup - taskID:${taskID} githubIssueNo:${githubIssueNo} labelName:${labelName} error:`, error)
  }
  return
}

export { handleNewLabel }