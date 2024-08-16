import fetch from 'node-fetch';

const deleteClickupWebhook = async (clickupWebhookID) => {
  const resp = await fetch(
    `https://api.clickup.com/api/v2/webhook/${clickupWebhookID}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: process.env.CLICKUP_API_KEY
      }
    }
  )

  const data = await resp.text()
  console.log(data)
}

export default deleteClickupWebhook