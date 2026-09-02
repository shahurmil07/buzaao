import cookieParser from 'cookie-parser'
import cors, { type CorsOptions } from 'cors'
import express, { type Express } from 'express'
import { isCorsOriginAllowed } from './config/env.js'
import { bootstrapDatabase } from './db/bootstrap.js'
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
  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      if (!origin || isCorsOriginAllowed(origin)) {
        callback(null, origin ?? true)
        return
      }
      callback(null, false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }

  app.use(cors(corsOptions))
  app.options('*', cors(corsOptions))
  app.use(cookieParser())
  app.use(express.json())

  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      next()
      return
    }
    void bootstrapDatabase().then(() => next()).catch(next)
  })

  app.get('/', (_req, res) => {
    res.json({ ok: true, service: 'buzaao-api' })
  })
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

const app = createApp()

export default app
