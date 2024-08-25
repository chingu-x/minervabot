import fetch from 'node-fetch'
import { Octokit } from 'octokit'
import getTaskID from '../util/getTaskID.js'

// When a new priority label (`priority/...`) is assigned to the issue add a 
// cooresponding priority to the cooresponding ClickUp Task.
const handleNewPriority = async (githubIssueNo, taskPriority) => {
  console.log(`handleNewPriority - githubIssueNo:${ githubIssueNo } taskPriority:`, taskPriority)

  let taskID

  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })
    
    // Retrieve the associated ClickUp Task ID that was added as a comment to 
    // the GitHub Issue  
    taskID = await getTaskID(githubIssueNo) 
    if (taskID !== -1) {
      // Extract the Clickup priority from the new label and add it to the
      // associated Clickup Task
      const query = new URLSearchParams({
          custom_task_ids: 'true',
          team_id: process.env.CLICKUP_TEAM_ID
      }).toString()
      
      const taskId = taskID
      const response = await fetch(
        `https://api.clickup.com/api/v2/task/${taskId}?${query}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.CLICKUP_API_KEY
          },
          body: JSON.stringify({
            priority: taskPriority
          })
        }
      )
    }
  }
  catch (error) {
      throw Error(`handleNewStatus - taskID:${taskID} githubIssueNo:${githubIssueNo} labelName:${labelName} error:`, error)
  }
  return
}

export default handleNewPriority