import type { Request, Response } from 'express'
import { sendError } from '../lib/http-error.js'
import { createPurchase, listPurchasingUsers, OrderValidationError } from '../services/order.js'

export async function createOrderHandler(req: Request, res: Response) {
  try {
    const order = await createPurchase(req.body as Record<string, unknown>)
    res.status(201).json({ order })
  } catch (error) {
    if (error instanceof OrderValidationError) {
      sendError(res, 400, 'INVALID_INPUT', error.message)
      return
    }
    throw error
  }
}

export async function listUsersHandler(_req: Request, res: Response) {
  const users = await listPurchasingUsers()
  res.json({ users })
}
