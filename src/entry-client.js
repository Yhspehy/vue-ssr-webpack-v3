import Vue from 'vue'
import 'es6-promise/auto'
import {
  createApp
} from './app'
import ProgressBar from './components/ProgressBar.vue'

// global progress bar
// 顶部的进度条
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

// a global mixin that calls `asyncData` when a route component's params change
// 当路由更新的时候，vue全局注入的这个钩子会监听到this.$optionis.asyncData这个函数并执行
// 我这边讲它注释掉了，不让他执行了
Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    next()
    // const {
    //   asyncData
    // } = this.$options
    // if (asyncData) {
    //   asyncData({
    //     store: this.$store,
    //     route: to
    //   }).then(next).catch(next)
    // } else {
    //   next()
    // }
  }
})

const {
  app,
  router,
  store
} = createApp()

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
// 使用server-initialized的状态来填装stroe
// 状态会在SSR期间被确定，在页面初始化的使用被应用
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// wait until router has resolved all async before hooks
// and async components...
// 当路由处理了所有的异步操作后才会执行钩子以及异步组件
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  // 为asyncData函数添加路由钩子
  // 在路由初始化之后才会执行，这样我们就不会二次获取我们已经获取过的数据了。
  // 使用router.beforeResolve()就可以让所有的异步组件加载完成。
  router.beforeResolve((to, from, next) => {

    // 获取前往和当前路由，比较这两个路由是否相同，不相同则返回要前往的路由。

    // const matched = router.getMatchedComponents(to)
    // const prevMatched = router.getMatchedComponents(from)

    // let diffed = false
    // const activated = matched.filter((c, i) => {
    //   return diffed || (diffed = (prevMatched[i] !== c))
    // })





    // 由于我暂时不需要执行asyncData这个函数，所以我就将相关的函数注释了。
    // 首先是先偶去asyncData函数，然后开启顶部进度条，执行函数来异步获取数据
    // 当返回数据后执行bar.finish()，并执行路由的next()
    // const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    // if (!asyncDataHooks.length) {
    //   return next()
    // }

    bar.start()
    setTimeout(() => {
      bar.finish()
    }, 1000);
    next()
    // Promise.all(asyncDataHooks.map(hook => hook({
    //     store,
    //     route: to
    //   })))
    //   .then(() => {
    //     bar.finish()
    //     next()
    //   })
    //   .catch(next)
  })

  // actually mount to DOM
  // 初始化app
  app.$mount('#app')
})

// service worker
// 注册Service Worker脚本
// 主要功能是能在浏览器后台运行脚本
// 能够拦截监听网络请求
// 由于我们不需要，所以我先把它注释了
// if ('https:' === location.protocol && navigator.serviceWorker) {
//   navigator.serviceWorker.register('/service-worker.js')
// }