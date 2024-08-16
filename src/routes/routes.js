import express from 'express'
import { handleGitHubEvents } from '../controllers/handleGitHubEvents.js'
import { handleClickupEvents } from '../controllers/handleClickupEvents.js'

const router = express.Router()

router.route('/ghwebhook')
  .post(handleGitHubEvents)

router.route('/cuwebhook')
  .post(handleClickupEvents)

export default router