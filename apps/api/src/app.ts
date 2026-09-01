import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type Express } from 'express'
import { errorHandler } from './middleware/error-handler.js'
import { requireAdmin } from './middleware/require-admin.js'
import { authRouter } from './routes/auth.js'
import { couponRouter } from './routes/coupon.js'
import { healthRouter } from './routes/health.js'
import { ordersRouter } from './routes/orders.js'
import { publicCouponRouter } from './routes/public-coupons.js'
import { usersRouter } from './routes/users.js'

export function createApp(): Express {
  const app = express()

  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
  )
  app.use(cookieParser())
  app.use(express.json())

  app.use('/health', healthRouter)
  app.use('/api/health', healthRouter)
  app.use('/api/admin', authRouter)
  app.use('/api/admin/coupons', requireAdmin, couponRouter)
  app.use('/api/admin/users', requireAdmin, usersRouter)
  app.use('/api/coupons', publicCouponRouter)
  app.use('/api/orders', ordersRouter)

  app.use(errorHandler)

  return app
}
