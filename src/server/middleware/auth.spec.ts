import sinon from 'sinon'
import express from 'express'
import fetch from 'node-fetch'
import request from 'supertest'
import config from '../../config'
import { introspect, authenticated, isSelf, isAdmin } from './auth'
import { error } from './error'

describe('error handler middleware', () => {
  describe('authenticated', () => {
    beforeEach(() => {
      sinon.stub(config, 'get').returns('someURL')
    })

    afterEach(() => sinon.restore())

    it('should return 401 when cookie is not valid', (done) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sinon.stub(fetch, 'Promise').resolves({
        status: 401,
      })

      const testApp = express()
        .use(introspect)
        .get('/test', (req, res) => {
          res.sendStatus(200)
        })

      request(testApp)
        .get('/test')
        .set('Cookie', 'token=imafancyjwtaccesstoken')
        .expect(401)
        .then(() => done())
        .catch((err: Error) => done(err))
    })

    it('should return 500 when introspection fails', (done) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sinon.stub(fetch, 'Promise').rejects()

      const testApp = express()
        .use(introspect)
        .get('/test', (req, res) => {
          res.sendStatus(200)
        })
        .use(error)

      request(testApp)
        .get('/test')
        .set('Cookie', 'token=imafancyjwtaccesstoken')
        .expect(500)
        .then(() => done())
        .catch((err: Error) => done(err))
    })

    it('should call next when cookie introspection is successful', (done) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sinon.stub(fetch, 'Promise').resolves({
        status: 200,
        json: async () => ({ id: 1 }),
      })

      const testApp = express()
        .use(introspect)
        .get('/test', authenticated, (req, res) => {
          res.sendStatus(200)
        })
        .use(error)

      request(testApp)
        .get('/test')
        .set('Cookie', 'token=imafancyjwtaccesstoken')
        .expect(200)
        .then(() => done())
        .catch((err: Error) => done(err))
    })

    it('should continue to route when there is no cookie', (done) => {
      const testApp = express()
        .use(introspect)
        .get('/test', (req, res) => {
          res.sendStatus(200)
        })

      request(testApp)
        .get('/test')
        .expect(200)
        .then(() => done())
        .catch((err: Error) => done(err))
    })
  })

  describe('authenticated', () => {
    it('should return 401 when there is no authenticated user', (done) => {
      const testApp = express()
        .get('/test', authenticated, (req, res) => {
          res.sendStatus(200)
        })

      request(testApp)
        .get('/test')
        .expect('Content-Type', /json/)
        .expect(401)
        .then(() => done())
        .catch((err: Error) => done(err))
    })

    it('should return continue to route when there is an authenticated user', (done) => {
      const testApp = express()
        .use((req, res, next) => {
          res.locals.authenticatedUser = {}
          next()
        })
        .get('/test', authenticated, (req, res) => {
          res.sendStatus(200)
        })

      request(testApp)
        .get('/test')
        .expect(200)
        .then(() => done())
        .catch((err: Error) => done(err))
    })
  })

  describe('isSelf', () => {
    it('should return 403 when param id does not match user id', (done) => {
      const testApp = express()
        .use((req, res, next) => {
          res.locals.authenticatedUser = { id: 1 }
          next()
        })
        .get('/test/:id', isSelf, (req, res) => {
          res.sendStatus(200)
        })

      request(testApp)
        .get('/test/100')
        .expect('Content-Type', /json/)
        .expect(403)
        .then(() => done())
        .catch((err: Error) => done(err))
    })

    it('should continue to route when there is an authenticated user', (done) => {
      const testApp = express()
        .use((req, res, next) => {
          res.locals.authenticatedUser = { id: 1 }
          next()
        })
        .get('/test/:id', isSelf, (req, res) => {
          res.sendStatus(200)
        })

      request(testApp)
        .get('/test/1')
        .expect(200)
        .then(() => done())
        .catch((err: Error) => done(err))
    })
  })

  describe('isAdmin', () => {
    it('should return 403 when user role is not "admin"', (done) => {
      const testApp = express()
        .use((req, res, next) => {
          res.locals.authenticatedUser = { role: { name: 'developer' } }
          next()
        })
        .get('/test/:id', isAdmin, (req, res) => {
          res.sendStatus(200)
        })

      request(testApp)
        .get('/test/100')
        .expect('Content-Type', /json/)
        .expect(403)
        .then(() => done())
        .catch((err: Error) => done(err))
    })

    it('should continue to route when there user is admin', (done) => {
      const testApp = express()
        .use((req, res, next) => {
          res.locals.authenticatedUser = { role: { name: 'admin' } }
          next()
        })
        .get('/test/:id', isAdmin, (req, res) => {
          res.sendStatus(200)
        })

      request(testApp)
        .get('/test/1')
        .expect(200)
        .then(() => done())
        .catch((err: Error) => done(err))
    })
  })
})
