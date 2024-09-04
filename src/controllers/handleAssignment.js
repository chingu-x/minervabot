import getClickupUserID from '../util/getClickupUserID.js'
import getTaskID from '../util/getTaskID.js'

// When a new status label (`status/...`) is assigned to the issue add a cooresponding 
// tag to the cooresponding ClickUp Task.
const handleAssignment = async (githubIssueNo, body) => {
  console.log(`handleAssignment - githubIssueNo:${ githubIssueNo } body:`, body)
  console.log(`handleAssignment - body.issue.assignees:`, body.issue.assignees)

  let taskID

  try {
    // Retrieve the associated ClickUp Task ID that was added as a comment to 
    // the GitHub Issue  
    taskID = await getTaskID(githubIssueNo) 
    if (taskID !== -1) {
      // Lookup the Clickup user ID for the GitHub user assigned to the task
      const userNameTranslationMap = [
        { githubUserName: 'jdmedlock', clickupUserName: 'Jim Medlock' }
      ]
      const userNameTranslation = userNameTranslationMap.find(( entry ) => entry.githubUserName === body.issue.assignee.login)
      console.log(`handleAssignment - assignee:${ body.issue.assignee.login } userNameTranslation:`, userNameTranslation)
      if (userNameTranslation !== undefined) {
        console.log(`handleAssignment - userNameTranslation.clickupUserName:`, userNameTranslation.clickupUserName)
        const clickupUserID = await getClickupUserID(userNameTranslation.clickupUserName)
        console.log(`handleAssignment - clickupUserID:`, clickupUserID)

        const query = new URLSearchParams({
          custom_task_ids: 'true',
          team_id: process.env.CLICKUP_TEAM_ID
        }).toString()
      
        const taskId = process.env.CLICKUP_TASK_ID
        const response = await fetch(
          `https://api.clickup.com/api/v2/task/${taskId}?${query}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: process.env.CLICKUP_API_KEY
            },
            body: JSON.stringify({
              assignees: {add: [clickupUserID]},
            })
          }
        )
      
        const data = await response.json()
        console.log(`handleAssignment - update data:`, data)
      }
    }
  }
  catch (error) {
      throw Error(`handleAssignment - githubIssueNo:${githubIssueNo} error:`, error)
  }
  return
}

export default handleAssignment