---
date: 2021-11-02
tags: 
  - nextjs
  - react
---

# nextjs

nextjs是一款基于react服务端渲染框架,对比之下有基于vue的nuxtjs,名字只有一个字母的差别,而且正好e是react的第二个字母,u是vue的第二个字母。最近nuxtjs出了3, nextjs出了12, 很有噱头的样子。

## 全局状态管理

react中状态管理根据可以用useState, useReducer, 有全局状态管理需求的话可以useContext配合useReducer, 或者用第三方库redux、mobx等,下面演示用useReducer+useContext做一个store

```js
// context.js
import React from 'react'
const AppContext = React.createContext()
export default AppContext
```

```js
// store.js
import React from "react"
function reducer(state, action) {
  switch(action.type) {
    case 'setUser':
      return Object.assign({}, state, {userInfo: action.payload})
    default:
      throw new Error('unknown action type')
  }
}

function useStore(initialState) {
  return React.useReducer(reducer, initialState)
}

export default useStore
```

```js
// _app.js
export default function MyApp({ Component, pageProps, initialState }) {
  const getLayout = Component.getLayout || ((page) => page)
  const store = useStore(initialState)

  return <AppContext.Provider value={store}>
    {getLayout(<Component {...pageProps} />)}
  </AppContext.Provider>
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  const res = await request({path: '/my', context: appContext.ctx})

  return {
    pageProps: {
      ...appProps.pageProps,
    },
    initialState: {userInfo: res.userInfo}
  }
}
```

注意这里重写了MyApp.getInitialProps方法,因为nextjs不支持在_app里使用getServerSideProps[^1]

```js
// 组件里使用
import AppContext from '../../context'
import { useContext } from 'react'

export default function UserInfo({ children }) {
  const [state, dispatch] = useContext(AppContext)
  const {userInfo} = state
  return <div>{userInfo}</div>
}
```

## swr

官方定义是用于数据请求的react hooks库, 据说swr背后也是nextjs团队
> “SWR” 这个名字来自于 stale-while-revalidate：一种由 HTTP RFC 5861 推广的 HTTP 缓存失效策略。这种策略首先从缓存中返回数据（过期的）,同时发送 fetch 请求（重新验证）,最后得到最新数据。

上面说的全局状态管理,大部分情况下是api请求数据的管理,swr可以代替,其他一些诸如主题、国际化的东西可以用useContext。swr缓存的概念感觉很像apollo client。swr还支持服务端渲染：

```js
const Comp = () => {
  const { data, error } = useSWR('/api', fetcher)
  if (error) return <div>failed to load</div>
  if (!error && !data) return <div>loading...</div>
  return <>{data}</>
}
export default function Page({fallback}) {
  
  return (
    <SWRConfig value={{ fallback }}>
      <Comp />
    </SWRConfig>)
}

export async function getServerSideProps(context) {
  const data = await request({path: '/api', context})
  return {
    props: {
      fallback: {
        '/api': data
      }
    }
  }
```

SWRConfig fallback 属性存储所有api key的初始数据, SWRConfig的所有子组件服务端渲染的时候useSWR返回对应的初始数据

## 参考资料

[^1]: [_app and getServerSideProps #10874](https://github.com/vercel/next.js/discussions/10874)