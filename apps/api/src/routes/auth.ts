import { Router, type Router as ExpressRouter } from 'express'
import { login, logout, me } from '../controllers/auth.js'
import { requireAdmin } from '../middleware/require-admin.js'

export const authRouter: ExpressRouter = Router()

authRouter.post('/login', (req, res, next) => {
  void login(req, res).catch(next)
})
authRouter.post('/logout', logout)
authRouter.get('/me', requireAdmin, me)
