import sinon from 'sinon'
import request from 'supertest'
import express, { NextFunction, Request, Response } from 'express'
import { UsersController } from './users'
import { subscription as subsRepo } from '../models'
import { error } from '../middleware'

describe('users controller', () => {
  const injectUser = (req: Request, res: Response, next: NextFunction) => {
    res.locals.authenticatedUser = { id: 1 }
    next()
  }

  afterEach(() => sinon.restore())

  describe('get user subscriptions', () => {
    const controller = new UsersController()
    const testApp = express()
      .use(injectUser)
      .use(controller.getRouter())
      .use(error)

    it('should return 200 when the user has no subscriptions', (done) => {
      sinon.stub(subsRepo, 'getUserSubscriptions').resolves([])

      request(testApp)
        .get('/users/1/subscriptions')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(() => done())
        .catch((err: Error) => done(err))
    })

    it('should return 200 when the user has subscriptions', (done) => {
      sinon.stub(subsRepo, 'getUserSubscriptions').resolves([{
        id: 10,
        name: 'acme app',
        description: 'lorem ipsum',
        logo: 'logoURLhere',
        publisherId: 999,
        publisherName: 'acme'
      }])

      request(testApp)
        .get('/users/1/subscriptions')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(() => done())
        .catch((err: Error) => done(err))
    })
  })
})
