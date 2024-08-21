import { Octokit } from 'octokit'

// Add the Clickup Task ID as a comment on a Github Issue. This will allow
// Minervabot to easily identify which Task should be updated in Clickup when
// a change is made to the original GitHub Issue.
let response

const connectIssueToClickup = async (clickupTaskID, githubIssueNo) => {
  console.log(`connectIssueToClickup - task ID:${ clickupTaskID } issue no: ${ githubIssueNo }`)
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })
    
    /*
    // Retrieve the GitHub Issue
    getIssueResponse = await octokit.request(`GET /repos/{owner}/{repo}/issues/${githubIssueNo}`, {
      owner: process.env.GITHUB_ORG,
      repo: process.env.GITHUB_REPO,
      issue_number: githubIssueNo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    */

    // Create an issue comment to note the id of the associated Clickup Task
    // TODO: add code here
    const addCommentResponse = await octokit.request(`POST /repos/${process.env.GITHUB_ORG}/${process.env.GITHUB_REPO}/issues/${githubIssueNo}/comments`, {
      owner: process.env.GITHUB_ORG,
      repo: process.env.GITHUB_REPO,
      issue_number: githubIssueNo,
      body: `**DO NOT MODIFY/DELETE THIS COMMENT**\nProject task ID: ${ clickupTaskID }`,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    console.log(`connectIssueToClickup - addCommentResponse: `, addCommentResponse)
  }
  catch (error) {
    throw Error(`connectIssueToClickup - clickupTaskID:${clickupTaskID} githubIssueNo:${githubIssueNo} error:`, error)
  }

  return
}

export default connectIssueToClickup