const express = require('express')
const { handleGitHubEvents } = require('../controllers/handleGitHubEvents')

const router = express.Router()

router.route('/webhook')
    .post(handleGitHubEvents)

module.exports = router