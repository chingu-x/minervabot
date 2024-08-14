import fetch from 'node-fetch'

// When a new GitHub Issue is created generate a cooresponding ClickUp Task.
const handleNewIssue = async (action, body) => {
  console.log(`action: ${ action } body:`, body) 

  // Remove any screenshots from the issue description
  const SCREENSHOTS_HEADING = 'Screenshots'
  const screenshotsIndex = body.issue.body.indexOf(SCREENSHOTS_HEADING)+SCREENSHOTS_HEADING.length
  let issueBody = body.issue.body.slice(0,screenshotsIndex)
  issueBody = issueBody.concat('\nSee GitHub issue for screenshots')
  issueBody = issueBody.concat(`\nGitHub Issue: ${ body.issue.url }`)
  issueBody = issueBody.concat(`\nReported by: ${ body.issue.user.login }`)

  const ADDL_CONTEXT_HEADING = 'Additional context'
  const addlContextIndex = body.issue.body.indexOf(ADDL_CONTEXT_HEADING)
  issueBody = issueBody.concat(body.issue.body.slice(addlContextIndex))

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
        name: body.issue.title,
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

  const tasks = await response.text()
  console.log(`handleNewIssue - tasks:`, tasks)

  return response
}

export { handleNewIssue }