const asyncHandler = require('express-async-handler')

const handleGitHubEvents = asyncHandler(async (req, res) => {
  // Get the parameters
  //const { userName, roleName } = req.body

})

exports.handleGitHubEvents = handleGitHubEvents
