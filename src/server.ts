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
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger.ts'

const app = express()
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  }
}))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(
  morgan('dev', { 
  skip: () => isTest(),
})
)


// Health check endpoint for monitoring and deployment platforms
/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check endpoint
 *     description: Returns API health status and system information
 *     security: []
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Process uptime in seconds
 *                 service:
 *                   type: string
 *                   example: SafeSite API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 environment:
 *                   type: string
 *                   example: development
 */
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

// Swagger UI on root path
app.use('/', swaggerUi.serve)
app.get('/', swaggerUi.setup(swaggerSpec, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 50px 0 }
    .swagger-ui .info .title { font-size: 2.5rem; color: #16a34a }
    .swagger-ui .info .description { font-size: 1.1rem; margin-top: 20px }
    .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px }
  `,
  customSiteTitle: 'SafeSite API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
    url: undefined, // Forces Swagger to use the spec provided directly
    validatorUrl: null // Disable schema validation to avoid external requests
  }
}))

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







