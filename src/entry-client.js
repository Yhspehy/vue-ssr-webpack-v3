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
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    // const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    // if (!asyncDataHooks.length) {
    //   return next()
    // }

    // bar.start()
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
// if ('https:' === location.protocol && navigator.serviceWorker) {
//   navigator.serviceWorker.register('/service-worker.js')
// }