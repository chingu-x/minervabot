import fetch from 'node-fetch'
import { Octokit } from 'octokit'
import getTaskID from '../util/getTaskID.js'

// When a label is removed from the issue also remove it from the cooresponding
// ClickUp Task.
const handleDeleteLabel = async (parms) => {
  const [githubIssueNo, body] = parms
  console.log(`handleDeleteLabel - githubIssueNo:${ githubIssueNo } labelName:`, labelName)

  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })
    
    // Retrieve the associated ClickUp Task ID that was added as a comment to 
    // the GitHub Issue  
    const taskID = await getTaskID(githubIssueNo) 
    if (taskID !== -1) {
      // Remove the tag with the same name from the associated Clickup Task
      const query = new URLSearchParams({
        custom_task_ids: 'true',
        team_id: process.env.CLICKUP_TEAM_ID
      }).toString()
    
      const taskId = taskID
      const tagName = body.label.name
      const response = await fetch(
        `https://api.clickup.com/api/v2/task/${taskId}/tag/${tagName}?${query}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.CLICKUP_API_KEY
          }
        }
      )
    }
  }
  catch (error) {
    throw Error(`handleDeleteLabel - taskID:${taskID} githubIssueNo:${githubIssueNo} labelName:${labelName} error:`, error)
  }
  return
}

export default handleDeleteLabel