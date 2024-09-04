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
        const response = await getClickupUserID(userNameTranslation.clickupUserName)
        console.log(`handleAssignment - response:`, response)
      }
    }
  }
  catch (error) {
      throw Error(`handleAssignment - githubIssueNo:${githubIssueNo} error:`, error)
  }
  return
}

export default handleAssignment