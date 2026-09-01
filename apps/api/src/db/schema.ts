import { pool } from './pool.js'

async function createAdminsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

async function createCouponsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS coupons (
      id TEXT PRIMARY KEY,
      code VARCHAR(64) NOT NULL UNIQUE,
      discount_type VARCHAR(16) NOT NULL CHECK (discount_type IN ('percent', 'amount')),
      discount_value INTEGER NOT NULL CHECK (discount_value > 0),
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0),
      expires_at DATE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

async function createOrdersTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(64) NOT NULL,
      company VARCHAR(255),
      notes TEXT,
      plan_id VARCHAR(64) NOT NULL,
      plan_name VARCHAR(128) NOT NULL,
      plan_price INTEGER NOT NULL,
      plan_category VARCHAR(32) NOT NULL,
      total INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price INTEGER NOT NULL,
      line_total INTEGER NOT NULL
    )
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (email)
  `)
  await pool.query(`
    CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC)
  `)

  await pool.query(`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal INTEGER
  `)
  await pool.query(`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(64)
  `)
  await pool.query(`
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_discount INTEGER NOT NULL DEFAULT 0
  `)
}

export async function ensureSchema() {
  await createAdminsTable()
  await createCouponsTable()
  await createOrdersTables()
}
