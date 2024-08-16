import asyncHandler from 'express-async-handler'

const handleClickupEvents = asyncHandler(async (request, response) => {
  // Respond to indicate that the delivery was successfully received.
  // Your server should respond with a 2XX response within 10 seconds of 
  // receiving a webhook delivery. 
  console.log(`handleClickupEvents - request.body:`, request.body)
  const { event, history_items } = req.body
  console.log(`handleClickupEvents - event:`, event)
  console.log(`handleClickupEvents - history_items:`, history_items)

  response.status(202).send('Accepted')

})

export { handleClickupEvents }
