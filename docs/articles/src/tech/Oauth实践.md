---
date: 2021-11-01
tags: 
  - oauth
  - fastify
---

# Oauth实践

## 简介

oauth是一种认证和授权技术，常用于第三方登录，比如github登录，下面都是以github为例进行讲解

## 流程

1. 用户请求你的服务器某个路由比如/login
2. 服务端redirect浏览器到授权页
`https://github.com/login/oauth/authorize?response_type=code&client_id=&redirect_url=domain/login/github/callback&state=`
3. 用户在授权页完成授权
4. github请求2参数里的redirect_url，参数里带着code和state
5. 服务端处理请求，通过state检测请求有效性，然后请求github access_token
`POST https://github.com/login/oauth/access_token`
6. 拿到access_token后就可以请求api获取用户信息
Authorization: token OAUTH-TOKEN
`GET https://api.github.com/user`
7. 然后服务端可以进行redirect浏览器到登录成功页，设置cookie等操作

## 第三方库

我用的是`fastify-oauth`,这个插件做了一些基本配置的事，还有2，提供了5的api。因为想在登录成功后跳转到原始登录页url里redirect_to指定的页面，没找到这个插件有提供这个原始url，就提了个issue。因为上次提issue没得到反馈，这次描述写的很简略，结果意外的很快就得到了回复，而且答复者很快给出了拦截初始请求自定义state的方案，最后问题完美解决:tada:，详情参见<https://github.com/fastify/fastify-oauth2/issues/121>

## 一些问题

### referer policy

本地测试的时候因为前后端是不同端口，/login/github请求的header里的referer并没有带querystring部分，原因是referer policy
> Since version 85 of Chrome, the referrer policy has changed for privacy reasons. If a site doesn’t define its own policy, then the default one applied by the browser will be strict-origin-when-cross-origin.
>
> With this policy, only the origin is sent in the Referer header of cross-origin requests. In order words, when our hit is fired, it is sent to our collection domain which is different from the domain of the site. In that case, only the main domain is set in the Referrer and the query string is lost

### Set-Cookie

第一次set-cookie没加path=/, 默认的cookie path是请求的当前路径即/login/github/callback, 登录后redirect指定页后cookie没了

### github timeout

授权成功后/login/github/callback接口504了，怀疑是访问github接口问题，果然在服务器上ping github.com不通，参考[^1]编辑/etc/hosts文件

```plain
140.82.114.3 github.com
199.232.69.194 github.global.ssl.fastly.net
```

能ping通了，ssl访问还是不通:disappointed:。

## 最终代码

```js
const defaultState = require('crypto').randomBytes(10).toString('hex')
fastify.register(oauthPlugin, {
  name: 'githubOAuth2',
  credentials: {
    client: {
      id: '',
      secret: ''
    },
    auth: oauthPlugin.GITHUB_CONFIGURATION
  },
  startRedirectPath: '/login/github',
  callbackUri: 'http://<domain>/api/login/github/callback',
  generateStateFunction: (request) => {
    const redirectUrl = new URLSearchParams(request.headers['referer'].split('?')[1]).get('redirect_to')
    const state = Buffer.from(JSON.stringify(Object.assign({}, {redirectUrl}, {defaultState}))).toString('base64')
    return state
  },
  checkStateFunction: (returnedState, callback) => {
    if (JSON.parse(Buffer.from(returnedState, 'base64').toString('ascii')).defaultState == defaultState) {
      callback()
      return
    }
    callback(new Error('Invalid state'))
  }
})
```

```js
fastify.get('/login/github/callback', opts, async (request, reply) => {
  const redirectUrl = JSON.parse(Buffer.from(request.query.state, 'base64').toString('ascii')).redirectUrl || '/'
  let token = await fastify.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
  const userinfo = await got('https://api.github.com/user', {
    headers: {'Authorization': `token ${token.access_token}`}
  }).json()
  let oauthUser = await fastify.prisma.oauthUser.findUnique({where: {provider_uid: {provider: 'github', uid: String(userinfo.id)}}})
  if(!oauthUser) {
    const user = await fastify.prisma.user.create({ data: { loginName: 'random', password: await fastify.bcrypt.hash('random') } })
    oauthUser = await fastify.prisma.oauthUser.create({ data: {uid: String(userinfo.id), provider: 'github', userId: user.id, specials: userinfo} })
  }
  token = fastify.jwt.sign({ id: oauthUser.userId })
  reply.header('Set-Cookie', [`token=${token}; expires=${new Date(new Date().getTime() + 7 * 24 * 3600 * 1000).toUTCString()}; path=/`])
  reply.redirect(redirectUrl)
})
```

## 参考

- [github-oauth](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [use-the-stored-url-to-redirect-users](https://auth0.com/docs/configure/attack-protection/state-parameters#use-the-stored-url-to-redirect-users)
- [Why-aren-t-my-query-string-parameters-retrieved](https://helpcentre.atinternet-solutions.com/hc/en-gb/articles/360017026680-Why-aren-t-my-query-string-parameters-retrieved-)

[^1]: [提高国内访问 github 速度的 9 种方法](https://zhuanlan.zhihu.com/p/314071453)
