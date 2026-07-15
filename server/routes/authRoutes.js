import express from 'express'
import { register, login, getCurrentUser, updateUser } from '../controllers/authController.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', auth, getCurrentUser)
router.put('/update', auth, updateUser)

export default router
