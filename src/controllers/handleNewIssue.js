import fetch from 'node-fetch'

// Get the 

// When a new GitHub Issue is created generate a cooresponding ClickUp Task.
const handleNewIssue = async (action, body) => {
  console.log(`An issue was opened with this title: ${ body.issue.title }`)
  console.log(`action: ${ action } body:`, body) 

  const query = new URLSearchParams({
    archived: 'false',
    include_markdown_description: 'true',
    page: '0',
    order_by: 'string',
    reverse: 'true',
    subtasks: 'true',
    statuses: 'string',
    include_closed: 'true',
    assignees: 'string',
    watchers: 'string',
    tags: 'string',
    due_date_gt: '0',
    due_date_lt: '0',
    date_created_gt: '0',
    date_created_lt: '0',
    date_updated_gt: '0',
    date_updated_lt: '0',
    date_done_gt: '0',
    date_done_lt: '0',
    custom_fields: 'string',
    custom_field: 'string',
    custom_items: '0'
  }).toString()

  const listId = '901203120708'
  const response = await fetch(
    `https://api.clickup.com/api/v2/list/${listId}/task?${query}`,
    {
      method: 'GET',
      headers: {
        Authorization: 'pk_90147991_A40W5F0M3QZCH9H6PVZHF50XZ0W8GH9A'
      }
    }
  )

  const data = await response.text()
  console.log(data)
  return true
}

export { handleNewIssue }