import express, {
  Application,
  Request,
  Response,
} from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import promBundle from 'express-prom-bundle'
import basicAuth from 'express-basic-auth'
import config from '../config'
import { version } from '../../package.json'
import { introspect, error } from './middleware/'
import {
  UsersController,
  BaseController, HealthController,
} from './controllers'

export default class App {
  private readonly app: Application

  constructor() {
    this.app = express()
    this.setupMiddleware()
    this.setupRoutes()
  }

  public getApp(): Application {
    return this.app
  }

  private setupMiddleware(): void {
    this.app.use(cors(config.get('cors')))
    this.app.use(helmet())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    morgan.token('body', (req: Request) => JSON.stringify(req.body))
    this.app.use(morgan(':method :url :status - :body'))

    this.app.use('/metrics', basicAuth({
      users: { [config.get('auth.metricsBasicAuthUser')]: config.get('auth.metricsBasicAuthPassword') },
      challenge: true,
    }))
    this.app.use(promBundle({ includeMethod: true }))

    this.app.use(introspect)
  }

  private setupSystemRoutes(): void {
    this.app.use('/', (req: Request, res: Response) => {
      res.json({ version })
    })

    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({ error: 'route not found' })
    })
  }

  private setupRoutes(): void {
    const controllers = this.initControllers()
    for(const c of controllers) {
      this.app.use(c.getRouter())
    }

    this.setupSystemRoutes()
    this.app.use(error)
  }

  private initControllers(): Array<BaseController> {
    return [
      new HealthController(),
      new UsersController(),
    ]
  }
}
