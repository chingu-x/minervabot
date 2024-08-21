import fetch from 'node-fetch'
import connectIssueToClickup from '../util/connectIssueToClickup.js'

// When a new GitHub Issue is created generate a cooresponding ClickUp Task.
const handleNewIssue = async (action, body) => {

  // Remove any screenshots from the issue description
  const SCREENSHOTS_HEADING = '***Screenshots***'
  const screenshotsIndex = body.issue.body.indexOf(SCREENSHOTS_HEADING)+SCREENSHOTS_HEADING.length
  let issueBody = `\n***Reported by***\n${ body.issue.user.login }`.concat('\n\n',body.issue.body)
  issueBody = issueBody.slice(0,screenshotsIndex)
  issueBody = issueBody.concat('\nSee GitHub issue for screenshots')
  issueBody = issueBody.concat(`\nGitHub Issue:\n${ body.issue.html_url }`)

  const ADDL_CONTEXT_HEADING = '***Additional context***'
  const addlContextIndex = body.issue.body.indexOf(ADDL_CONTEXT_HEADING)
  issueBody = issueBody.concat('\n\n',body.issue.body.slice(addlContextIndex))

  const GH_ISSUE_HEADING = '***GitHub Issue No. / ID***'
  const githubIssueIndex = issueBody.indexOf(GH_ISSUE_HEADING) + GH_ISSUE_HEADING.length
  issueBody = issueBody.slice(0, githubIssueIndex).concat(`\n${body.issue.number} / ${body.issue.id}\n\n`)

  const TEAM_TASK_HEADING = '***Team Task***'
  let teamTaskIndex = body.issue.body.indexOf(TEAM_TASK_HEADING)
  issueBody = issueBody.concat(body.issue.body.slice(teamTaskIndex))

  const query = new URLSearchParams({
    custom_task_ids: 'false',
    team_id: process.env.CLICKUP_TEAM_ID
  }).toString()

  const listId = process.env.CLICKUP_LIST_ID
  const response = await fetch(
    `https://api.clickup.com/api/v2/list/${listId}/task?${query}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.CLICKUP_API_KEY
      },
      body: JSON.stringify({
        name: body.issue.title.concat(`[GH#:${body.issue.number}/ID:${body.issue.node_id}]`),
        description: issueBody,
        markdown_description: issueBody,
        assignees: [],
        archived: false,
        group_assignees: [],
        tags: ['bug'],
        status: 'Open',
        priority: 3,
        due_date_time: false,
        start_date_time: false,
        points: 3,
        notify_all: true,
        parent: null,
        links_to: null,
        check_required_custom_fields: true,
      })
    }
  )

  const task = await response.text()
  console.log(`handleNewIssue - task:`, task)
  console.log(`handleNewIssue - task.tasks:`, task.tasks)
  await connectIssueToClickup(task.tasks.id, body.issue.number)

  return response
}

export { handleNewIssue }