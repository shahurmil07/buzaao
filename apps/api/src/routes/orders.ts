import { Router, type Router as ExpressRouter } from 'express'
import { createOrderHandler } from '../controllers/order.js'
import { asyncHandler } from '../middleware/async-handler.js'

export const ordersRouter: ExpressRouter = Router()

ordersRouter.post('/', asyncHandler(createOrderHandler))
