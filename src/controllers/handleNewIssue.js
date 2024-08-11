// When a new GitHub Issue is created generate a cooresponding ClickUp Task.
const handleNewIssue = (action, body) => {
  console.log(`An issue was opened with this title: ${ body.issue.title }`)
  console.log(`action: ${ action } body:`, body) 
}

exports.handleNewIssue = handleNewIssue