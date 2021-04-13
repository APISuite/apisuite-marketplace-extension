import { Request, Response, Router } from 'express'
import { AsyncHandlerResponse } from '../types'
import { BaseController } from './base'
import { subscription as subsRepo } from '../models'
import { authenticated, isSelf, asyncWrap as aw } from '../middleware/'

export class UsersController implements BaseController {
  private readonly path = '/users'

  public getRouter(): Router {
    const router = Router()
    router.get(`${this.path}/:id/subscriptions`, authenticated, isSelf, aw(this.getUserSubscriptions))
    return router
  }

  public getUserSubscriptions = async (req: Request, res: Response): AsyncHandlerResponse => {
    const subs = await subsRepo.getUserSubscriptions(null, Number(req.params.id))

    return res.status(200).json({
      data: subs,
    })
  }
}
