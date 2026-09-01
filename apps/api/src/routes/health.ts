import { Router, type Router as ExpressRouter } from 'express'
import { getHealth } from '../controllers/health.js'

export const healthRouter: ExpressRouter = Router()

healthRouter.get('/', getHealth)
