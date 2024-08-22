import fetch from 'node-fetch'

// When a new GitHub Issue is created generate a cooresponding ClickUp Task.
const handleLabelChanges = async (action, body) => {
  console.log(`handleLabelChanges - action:${ action } body:`, body)
  return
}

export { handleLabelChanges }