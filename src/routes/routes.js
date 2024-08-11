import express from 'express'
import { handleGitHubEvents } from '../controllers/handleGitHubEvents.js'

const router = express.Router()

router.route('/webhook')
    .post(handleGitHubEvents)

export default router