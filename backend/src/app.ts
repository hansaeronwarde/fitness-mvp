import cors from 'cors'
import express from 'express'
import pinoHttp from 'pino-http'
import { errorHandler } from './middleware/errorHandler'
import { router } from './routes/index'


const app = express()
const corsOrigin = 'http://localhost:5173'

app.use(express.json({ limit: '1mb' }))
app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })
)

app.use(pinoHttp({ quietReqLogger: true }))
app.use('/api', router)
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use(errorHandler)

export default app