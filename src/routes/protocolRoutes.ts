import { Router } from 'express'
import { validateBody, validateParams } from '../middleware/validation.ts'
import { z } from 'zod'
import { authenticateToken } from '../middleware/auth.ts'
import { 
  createProtocol, 
  getProtocols, 
  updateProtocol,
  deleteProtocol,
  getProtocolById,
  createComplianceLog,
  getComplianceLogs
} from '../controllers/protocolController.ts'

const createProtocolSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'SHIFT_START', 'SHIFT_END']),
  targetCount: z.number().min(1),
  zoneIds: z.array(z.string()).optional()
})

const updateProtocolSchema = z.object({
  name: z.string().min(3).max(200).optional(),
  description: z.string().optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'SHIFT_START', 'SHIFT_END']).optional(),
  targetCount: z.number().min(1).optional(),
  isActive: z.boolean().optional(),
  zoneIds: z.array(z.string()).optional()
})

const protocolParamsSchema = z.object({
  id: z.string().uuid(),
})

const createComplianceLogSchema = z.object({
  completionDate: z.string().datetime().optional(),
  note: z.string().max(500).optional(),
})

const router = Router()

// Apply authentication to all protocol routes
router.use(authenticateToken)

// Protocol CRUD operations
router.get('/', getProtocols)
router.post('/', validateBody(createProtocolSchema), createProtocol)
router.get('/:id', validateParams(protocolParamsSchema), getProtocolById)
router.patch('/:id', validateParams(protocolParamsSchema), validateBody(updateProtocolSchema), updateProtocol)
router.delete('/:id', validateParams(protocolParamsSchema), deleteProtocol)

// Compliance log operations
router.post('/:id/compliance-logs', 
  validateParams(protocolParamsSchema), 
  validateBody(createComplianceLogSchema), 
  createComplianceLog
)
router.get('/:id/compliance-logs', 
  validateParams(protocolParamsSchema), 
  getComplianceLogs
)

export default router
