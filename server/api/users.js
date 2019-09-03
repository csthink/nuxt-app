import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import UserModel from '../models/users'
import emailConfig from '../config/email'
import Passport from '../helpers/passport'
import axios from '../helpers/axios'

const router = new Router({ prefix: '/users' })

const Store = new Redis().client

router.post('/signup', async (ctx) => {
  const { username, password, email, code } = ctx.request.body
  const result = { code: -1, msg: '' }
  if (!code) {
    result.msg = '请填写验证码'
    ctx.body = result
    return false
  }

  const saveCode = await Store.hget(`nodemail:${username}`, 'code')
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')

  if (code !== saveCode) {
    result.msg = '请填写正确的验证码'
    ctx.body = result
    return false
  }

  if (new Date().getTime() - saveExpire > 0) {
    result.msg = '验证码已过期，请重新尝试'
    ctx.body = result
    return false
  }

  const user = await UserModel.find({ username })
  if (user.length) {
    result.msg = '账号已被注册'
    ctx.body = result
    return false
  }

  const newUser = await UserModel.create({ username, password, email })
  if (!newUser) {
    result.msg = '注册失败,请稍后重试'
    ctx.body = result
    return false
  }

  const response = await axios.post('/users/signin', { username, password })
  if (!response.data || response.data.code !== 0) {
    result.msg = 'error'
    ctx.body = result
    return false
  }

  result.code = 0
  result.msg = '注册成功'
  // result.user = response.data.user
  ctx.body = result
})

router.post('/signin', (ctx, next) => {
  return Passport.authenticate('local', function(err, user, info, status) {
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    } else if (user) {
      ctx.body = {
        code: 0,
        msg: '登录成功',
        user
      }
      return ctx.login(user)
    } else {
      ctx.body = {
        code: 1,
        msg: info
      }
    }
  })(ctx, next)
})

router.post('/verify', async (ctx, next) => {
  const username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')

  const user = await UserModel.find({ username })
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: '账号已被注册'
    }

    return false
  }

  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    ctx.body = {
      code: -1,
      msg: '验证请求过于频繁，1分钟内1次'
    }

    return false
  }

  const transporter = nodeMailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
  })

  const code = emailConfig.code()

  const mailOptions = {
    from: `"认证邮件" <${emailConfig.user}>`,
    to: ctx.request.body.email,
    subject: 'vue ssr 注册码',
    html: `您的邀请码是${code}`
  }

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      // eslint-disable-next-line no-console
      return console.log(error)
    } else {
      Store.hmset(
        `nodemail:${ctx.request.body.username}`,
        'code',
        code,
        'expire',
        emailConfig.expire(),
        'email',
        ctx.request.body.email
      )
    }
  })

  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }
})

router.get('/exit', async (ctx, next) => {
  await ctx.logout()

  if (ctx.isAuthenticated()) {
    ctx.body = {
      code: -1
    }
    return false
  }

  ctx.body = {
    code: 0
  }
})

router.get('/getUser', (ctx) => {
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      user: '',
      email: ''
    }

    return false
  }

  const { username, email } = ctx.session.passport.user
  ctx.body = {
    user: username,
    email
  }
})

export default router
