import fetch from 'node-fetch'

// When a new GitHub Issue is created generate a cooresponding ClickUp Task.
const handleNewIssue = async (action, body) => {
  console.log(`action: ${ action } body:`, body) 

  const issueBody = body.issue.body.concat(`<br>GitHub Issue: ${ body.issue.url }`)

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