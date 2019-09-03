import Koa from 'koa'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
import json from 'koa-json'
import nuxtConfig from '../nuxt.config'
import users from './api/users'
import passport from './helpers/passport'
import serverConfig from './config/index'

const app = new Koa()

app.keys = ['keys', 'keykeys']
app.proxy = true
app.use(session({ key: 'ssr', prefix: 'ssr:uid', store: new Redis() }))
// 处理POST请求，把 koa2上下文的 formData 数据解析到 ctx.request.body
app.use(
  bodyParser({
    extendTypes: ['json', 'form', 'text']
  })
)
app.use(json())
// 连接 mongodb
mongoose.connect(serverConfig.mongo.URI, serverConfig.mongo.OPTIONS)
app.use(passport.initialize())
app.use(passport.session())

// Set Nuxt.js options
nuxtConfig.dev = app.env !== 'production'

async function start() {
  const nuxt = new Nuxt(nuxtConfig)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (nuxtConfig.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(users.routes()).use(users.allowedMethods())

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
