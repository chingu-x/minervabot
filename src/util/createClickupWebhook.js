import axios from 'axios'

const createClickupWebhook = async () => {
  try {
    const response = await axios.post(`https://api.clickup.com/api/v2/team/${process.env.CLICKUP_TEAM_ID}/webhook`, {
      endpoint: process.env.CLICKUP_WEBHOOK_URL,
      events: ['taskUpdated'],
      space_id: process.env.CLICKUP_SPACE_ID
    }, {
      headers: {
        'Authorization': process.env.CLICKUP_API_KEY,
        'Content-Type': 'application/json'
      }
    })
    console.log('Webhook created:', response.data)
  } catch (error) {
    console.error('Error creating webhook:', error)
  }
}

export default createClickupWebhook