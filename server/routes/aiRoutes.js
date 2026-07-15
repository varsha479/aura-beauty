import express from 'express'
import {
  analyzeBeautyProfile,
  getRecommendations,
  virtualTryOn
} from '../controllers/aiController.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

router.post('/analyze', auth, analyzeBeautyProfile)
router.post('/recommendations', auth, getRecommendations)
router.post('/try-on', auth, virtualTryOn)

export default router
