import { Octokit } from "octokit"

// Retrieve the associated Clickup Task ID from a GitHub Issue comment
const getTaskID = async (githubIssueNo) => {
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

    const searchString = '**DO NOT MODIFY/DELETE THIS COMMENT**\r\nProject task ID: '
    for (let comment of issueComments.data) {
      const taskIDIndex = comment.body.indexOf(searchString)
      if (taskIDIndex !== -1) {
        const taskID = comment.body.slice(taskIDIndex+searchString.length)
        return taskID // Return the associated task ID from the issue comment
      }
    }
  }
  catch (error) {
    throw Error(`connectIssueToClickup - taskID:${taskID} githubIssueNo:${githubIssueNo} labelName:${labelName} error:`, error)
  }
  return -1 // Task ID not found
}

export default getTaskID