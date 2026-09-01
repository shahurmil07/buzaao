import { Router, type Router as ExpressRouter } from 'express'
import { listUsersHandler } from '../controllers/order.js'
import { asyncHandler } from '../middleware/async-handler.js'

export const usersRouter: ExpressRouter = Router()

usersRouter.get('/', asyncHandler(listUsersHandler))
