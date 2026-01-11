import { Router } from 'express'
import { validateBody, validateParams } from '../middleware/validation.ts'
import { z } from 'zod'
import { authenticateToken } from '../middleware/auth.ts'
import { createHabit } from '../controllers/habitController.ts'


const createHabitSchema = z.object({
  name: z.string(),
  description: z.string(),
  frequency: z.string(),
  targetCount: z.string(),
  tagIds: z.array(z.string()).optional()
})

const completeParamsSchema = z.object({
  id: z.string(),
})

const router = Router()

router.use(authenticateToken)

router.get('/', (req, res) => {
  res.json({message: 'habits'})
})

router.get('/:id', (req, res) => {
  res.json({message: 'got one habit'})
})

router.post('/',
  validateBody(createHabitSchema), createHabit)

router.delete('/:id', (req, res) => {
  res.json({message: 'deleted habits'})
})


router.post('/:id/complete', 
  validateParams(completeParamsSchema), 
  validateBody(createHabitSchema), 
  
  (req, res) => {
  res.json({message: 'completed habit'}).status(201)
})

export default router