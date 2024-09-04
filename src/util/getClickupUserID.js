import fetch from 'node-fetch'
import getTaskID from './getTaskID.js'

// Retrieve the Clickup user id for a given email address
const getClickupUserID = async (userName) => {
  console.log(`getClickupUserID - userName:${ userName }`)

  try {
    // Extract the Clickup users for our List
    const listId = process.env.CLICKUP_LIST_ID
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/member`,
      {
        method: 'GET',
        headers: {
          Authorization: process.env.CLICKUP_API_KEY
        }
      }
    )
    const users = await response.json()
    console.log(`getClickupUserID - users:`, users)
    const clickupUser = users.members.find((user) => user.username === userName)
    return clickupUser.id
  }
  catch (error) {
      throw Error(`getClickupUserID - taskID:${taskID} githubIssueNo:${githubIssueNo} labelName:${labelName} error:`, error)
  }
  return undefined
}

export default getClickupUserID