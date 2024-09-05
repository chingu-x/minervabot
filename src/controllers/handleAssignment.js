import getClickupUserID from '../util/getClickupUserID.js'
import getTaskID from '../util/getTaskID.js'

// When a new status label (`status/...`) is assigned to the issue add a cooresponding 
// tag to the cooresponding ClickUp Task.
const handleAssignment = async (githubIssueNo, body) => {
  console.log(`handleAssignment - githubIssueNo:${ githubIssueNo } body:`, body)

  const userNameTranslationMap = [
    { githubUserName: 'Ajen07', clickupUserName: 'Arman Kumar Jena' },
    { githubUserName: '', clickupUserName: 'Austin Tang' },
    { githubUserName: 'siasktv', clickupUserName: 'Bianca Benitez' },
    { githubUserName: 'cherylii', clickupUserName: 'Cheryl' },
    { githubUserName: 'curlwl', clickupUserName: 'Curt W' },
    { githubUserName: 'Dan-Y-Ko', clickupUserName: 'Dan' },
    { githubUserName: '', clickupUserName: 'Dawn Dihn' },
    { githubUserName: '', clickupUserName: 'Eury Kim' },
    { githubUserName: '', clickupUserName: 'J. R.' },
    { githubUserName: 'JaneMoroz', clickupUserName: 'Jane Moroz' },
    { githubUserName: 'jdmedlock', clickupUserName: 'Jim Medlock' },
    { githubUserName: 'joekotvas', clickupUserName: 'Joseph Kotvas' },
    { githubUserName: 'JoshuaHinman', clickupUserName: 'Josh Hinman' },
    { githubUserName: 'MattRueter', clickupUserName: 'Matt Rueter' },
    { githubUserName: 'mladen-krstin', clickupUserName: 'Mladen Krstin' },
    { githubUserName: 'roziii', clickupUserName: 'Rozi' },
    { githubUserName: 'ellrub', clickupUserName: 'Ruben Ellefsen' },
    { githubUserName: 'timDeHof', clickupUserName: 'Tim DeHof' },
    { githubUserName: 'timothyrusso', clickupUserName: 'Timothy Russo' },
    { githubUserName: 'winniecwng', clickupUserName: 'Winnie Ng' },
  ]

  let taskID

  try {
    // Retrieve the associated ClickUp Task ID that was added as a comment to 
    // the GitHub Issue  
    taskID = await getTaskID(githubIssueNo) 
    if (taskID !== -1) {
      // Lookup the Clickup user ID for the GitHub user assigned to the task
      const userNameTranslation = userNameTranslationMap.find(( entry ) => entry.githubUserName === body.issue.assignee.login)
      if (userNameTranslation !== undefined) {
        const clickupUserID = await getClickupUserID(userNameTranslation.clickupUserName)
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
              assignees: { add: [clickupUserID], rem: [] },
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