import fetch from 'node-fetch'
import { Octokit } from 'octokit'

// When a new label is assigned to the issue add a cooresponding tag to the
// cooresponding ClickUp Task.
const handleNewLabel = async (githubIssueNo, issueLabels) => {
  console.log(`handleLabelChanges - githubIssueNo:${ githubIssueNo } issueLabels:`, issueLabels)

  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    })
    
    // Retrieve the associated ClickUp Task ID that was added as a comment to 
    // the GitHub Issue    
    const issueResponse = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
      owner: process.env.GITHUB_ORG,
      repo: process.env.GITHUB_REPO,
      issue_number: githubIssueNo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    console.log(`handleNewLabel - issueResponse: `, issueResponse)
  }
  catch (error) {
    throw Error(`connectIssueToClickup - clickupTaskID:${clickupTaskID} githubIssueNo:${githubIssueNo} error:`, error)
  }
  return
}

export { handleNewLabel }