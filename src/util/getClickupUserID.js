import fetch from 'node-fetch'

// Retrieve the Clickup user id for a given email address
const getClickupUserID = async (userName) => {
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
    const clickupUser = users.members.find((user) => user.username === userName)
    return clickupUser.id
  }
  catch (error) {
      throw Error(`getClickupUserID - taskID:${taskID} githubIssueNo:${githubIssueNo} labelName:${labelName} error:`, error)
  }
  return undefined
}

export default getClickupUserID