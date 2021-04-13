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
    router.post(`${this.path}/:id/subscriptions/:appId`, authenticated, isSelf, aw(this.subscribeApp))
    router.delete(`${this.path}/:id/subscriptions/:appId`, authenticated, isSelf, aw(this.unsubscribeApp))
    return router
  }

  public getUserSubscriptions = async (req: Request, res: Response): AsyncHandlerResponse => {
    const subs = await subsRepo.getUserSubscriptions(null, Number(req.params.id))

    return res.status(200).json({
      data: subs,
    })
  }

  public subscribeApp = async (req: Request, res: Response): AsyncHandlerResponse => {
    await subsRepo.create(null, {
      userId: Number(req.params.id),
      appId: Number(req.params.appId),
    })

    return res.status(201).json({
      data: req.params.appId,
    })
  }

  public unsubscribeApp = async (req: Request, res: Response): AsyncHandlerResponse => {
    await subsRepo.deleteSubscription(null, {
      userId: Number(req.params.id),
      appId: Number(req.params.appId),
    })

    return res.sendStatus(204)
  }
}
