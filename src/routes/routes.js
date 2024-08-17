import express from 'express'
import { handleGitHubEvents } from '../controllers/handleGitHubEvents.js'

const router = express.Router()

router.route('/ghwebhook')
  .post(handleGitHubEvents)

export default router