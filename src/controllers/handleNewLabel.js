import fetch from 'node-fetch'
import { Octokit } from 'octokit'

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
    const issueComments = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
      owner: process.env.GITHUB_ORG,
      repo: process.env.GITHUB_REPO,
      issue_number: githubIssueNo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    console.log(`handleNewLabel - issueComments: `, issueComments)
    const searchString = '**DO NOT MODIFY/DELETE THIS COMMENT**\nProject task ID: '
    for (let comment of issueComments) {
      const taskIDIndex = comment.body.indexOf(searchString)
      if (taskIDIndex !== -1) {
        // Add the new label as a tag on the associated Clickup Task
        taskID = comment.body.slice(taskIDIndex+searchString.length)
        console.log(`handleNewLabel - taskID:${ taskID }`)

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
      
        console.log(`handleNewLabel - resp:`, response)
        break
      }
    }
  }
  catch (error) {
    throw Error(`connectIssueToClickup - taskID:${taskID} githubIssueNo:${githubIssueNo} labelName:${labelName} error:`, error)
  }
  return
}

export { handleNewLabel }