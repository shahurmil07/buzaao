import { Router, type Router as ExpressRouter } from 'express'
import {
  createCouponHandler,
  deleteCouponHandler,
  listCouponsHandler,
  updateCouponHandler,
} from '../controllers/coupon.js'
import { asyncHandler } from '../middleware/async-handler.js'

export const couponRouter: ExpressRouter = Router()

couponRouter.get('/', asyncHandler(listCouponsHandler))
couponRouter.post('/', asyncHandler(createCouponHandler))
couponRouter.patch('/:id', asyncHandler(updateCouponHandler))
couponRouter.delete('/:id', asyncHandler(deleteCouponHandler))
