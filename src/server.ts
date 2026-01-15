import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import protocolRoutes from './routes/protocolRoutes.ts'
import hazardZoneRoutes from './routes/hazardZoneRoutes.ts'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { isTest } from '../env.ts'
import { errorHandler, APIError } from './middleware/errorHandler.ts'

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(
  morgan('dev', { 
  skip: () => isTest(),
})
)


// Health check endpoint for monitoring and deployment platforms
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'SafeSite API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SafeSite Field Compliance & Inspection API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      authentication: '/api/auth',
      protocols: '/api/protocols',
      hazardZones: '/api/hazard-zones',
      users: '/api/users'
    }
  })
})

app.use('/api/auth', authRoutes) 
app.use('/api/users', userRoutes)
app.use('/api/protocols', protocolRoutes)
app.use('/api/hazard-zones', hazardZoneRoutes) 

app.use((_,__, next) => {
  next(new APIError('Not Found', 'NotFoundError', 404))
})

app.use(errorHandler)

export { app }

export default app







