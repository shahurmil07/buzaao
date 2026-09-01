import { Router, type Router as ExpressRouter } from 'express'
import { previewCouponHandler } from '../controllers/coupon-preview.js'
import { asyncHandler } from '../middleware/async-handler.js'

export const publicCouponRouter: ExpressRouter = Router()

publicCouponRouter.post('/preview', asyncHandler(previewCouponHandler))
