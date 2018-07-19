import Vue from 'vue'
import App from './App.vue'
import {
    createStore
} from './store'
import {
    createRouter
} from './router'
import {
    sync
} from 'vuex-router-sync'
import * as filters from './util/filters'

// 注册全局的filter
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
// 导出一个工厂函数，它能创建一个完整的app vue实例
// 包含全新的vuex，vue-router(对每个SSR请求都有效)
export function createApp() {
    // create store and router instances
    // 添加vuex和vur-router
    const store = createStore()
    const router = createRouter()

    // sync the router with the vuex store.
    // this registers `store.state.route`
    // 同步vue-router数据，讲vue-router的状态存放到vuex中
    // 这样就可以通过修改vuex中router state来进行路由的一些操作
    sync(store, router)

    // create the app instance.
    // here we inject the router, store and ssr context to all child components,
    // making them available everywhere as `this.$router` and `this.$store`.
    // 创建app实例
    // 这里我们讲路由，状态和服务端渲染的参数都注入到每个子组件中
    // 从而能随时执行`this.$router`和`this.$store`
    const app = new Vue({
        router,
        store,
        render: h => h(App)
    })

    // expose the app, the router and the store.
    // note we are not mounting the app here, since bootstrapping will be
    // different depending on whether we are in a browser or on the server.
    // 到处这个app，router，store
    // 由于在客户端和服务端指令不同，所以我们不会在这里初始化app
    return {
        app,
        router,
        store
    }
}