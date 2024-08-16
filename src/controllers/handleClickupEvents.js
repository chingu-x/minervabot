import asyncHandler from 'express-async-handler'

const handleClickupEvents = asyncHandler(async (request, response) => {
  // Respond to indicate that the delivery was successfully received.
  // Your server should respond with a 2XX response within 10 seconds of 
  // receiving a webhook delivery. 
  response.status(202).send('Accepted')

})

export { handleClickupEvents }
