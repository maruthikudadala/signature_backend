const express = require('express')
const userController = require('./user.controller')
const router = express.Router()

router.post('/register',userController.UserRegister)
router.post('/login',userController.userLogin)


module.exports = router;