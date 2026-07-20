import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import { config } from './config'
import { connectDB } from './database'
import routes from './routes'
import { errorHandler, notFound } from './middleware/errorHandler'

const app = express()

app.use(helmet())
app.use(cors({ origin: config.cors.origin, credentials: true }))
app.use(compression())
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`[TaskFlow API] Server running on port ${config.port} in ${config.nodeEnv} mode`)
  })
})

export default app
