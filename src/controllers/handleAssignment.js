import getClickupUserID from '../util/getClickupUserID.js'
import getTaskID from '../util/getTaskID.js'
import { userTranslationMap } from '../util/userTranslationMap.js'

// When a new status label (`status/...`) is assigned to the issue add a cooresponding 
// tag to the cooresponding ClickUp Task.
const handleAssignment = async (action, githubIssueNo, body) => {
  console.log(`handleAssignment - action:${ action } githubIssueNo:${ githubIssueNo } body.assignee:`, body.assignee)

  let taskID

  try {
    // Retrieve the associated ClickUp Task ID that was added as a comment to 
    // the GitHub Issue  
    taskID = await getTaskID(githubIssueNo) 
    console.log(`handleAssignment - taskID: `, taskID)
    if (taskID !== -1) {
      // Lookup the Clickup user ID for the GitHub user assigned to the task
      const userName = userTranslationMap.find(( entry ) => entry.githubUserName === body.assignee.login)
      console.log(`handleAssignment - userName: `, userName)
      if (userName !== undefined) {
        const clickupUserID = await getClickupUserID(userName.clickupUserName)
        const assigneeAction = action === 'assigned' ? {add: [clickupUserID]} : {rem: [clickupUserID]}
        console.log(`handleAssignment - ClickupUseID:${ clickupUserID } assigneeAction: `, assigneeAction)
        const query = new URLSearchParams({
          custom_task_ids: 'true',
          team_id: process.env.CLICKUP_TEAM_ID
        }).toString()
      
        const response = await fetch(
          `https://api.clickup.com/api/v2/task/${taskID}?${query}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: process.env.CLICKUP_API_KEY
            },
            body: JSON.stringify({
              assignees: assigneeAction,
            })
          }
        )
      }
    }
  }
  catch (error) {
    throw Error(`handleAssignment - githubIssueNo:${githubIssueNo} error:`, error)
  }
  return
}

export default handleAssignment