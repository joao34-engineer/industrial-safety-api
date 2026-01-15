import { Router } from 'express'
import { validateBody, validateParams } from '../middleware/validation.ts'
import { z } from 'zod'
import { authenticateToken } from '../middleware/auth.ts'
import {
  createHazardZone,
  getHazardZones,
  getHazardZoneById,
  updateHazardZone,
  deleteHazardZone
} from '../controllers/hazardZoneController.ts'

const createHazardZoneSchema = z.object({
  name: z.string().min(3).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color code').optional(),
})

const updateHazardZoneSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color code').optional(),
})

const hazardZoneParamsSchema = z.object({
  id: z.string().uuid(),
})

const router = Router()

// Apply authentication to all hazard zone routes
router.use(authenticateToken)

// Hazard zone CRUD operations
router.get('/', getHazardZones)
router.post('/', validateBody(createHazardZoneSchema), createHazardZone)
router.get('/:id', validateParams(hazardZoneParamsSchema), getHazardZoneById)
router.patch('/:id', validateParams(hazardZoneParamsSchema), validateBody(updateHazardZoneSchema), updateHazardZone)
router.delete('/:id', validateParams(hazardZoneParamsSchema), deleteHazardZone)

export default router
