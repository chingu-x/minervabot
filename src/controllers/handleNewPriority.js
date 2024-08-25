import fetch from 'node-fetch'
import { Octokit } from 'octokit'
import getTaskID from '../util/getTaskID.js'

// When a new priority label (`priority/...`) is assigned to the issue add a 
// cooresponding priority to the cooresponding ClickUp Task.
const handleNewPriority = async (githubIssueNo, taskPriority) => {
  console.log(`handleNewPriority - githubIssueNo:${ githubIssueNo } taskPriority:`, taskPriority)

  let taskID

  try {
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
      
      // Convert the Priority name into its numeric equivalent
      const priorities = [
        { name: "Urgent", value: 1 },
        { name: "High", value: 2 },
        { name: "Normal", value: 3 },
        { name: "Low", value: 4 }
      ]
      const priority = priorities.find((priority) => priority.name === taskPriority)
      console.log(`handleNewPriority - priorityNumber:${ priority.value }`)
      if (priority === undefined) {
        return priority
      }

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
            priority: priority.value
          })
        }
      )
    }
  }
  catch (error) {
      throw Error(`handleNewPriority - taskID:${taskID} githubIssueNo:${githubIssueNo} taskPriority:${taskPriority} error:`, error)
  }
  return
}

export default handleNewPriority