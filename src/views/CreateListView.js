import ItemList from './ItemList.vue'

const camelize = str => str.charAt(0).toUpperCase() + str.slice(1)

// This is a factory function for dynamically creating root-level list views,
// since they share most of the logic except for the type of items to display.
// They are essentially higher order components wrapping ItemList.vue.
// 这是一个用来动态创建itemList的工厂函数，因为他们共享大部分的逻辑，除了条目的显示
// 他们本质上用来包装itemList.vue的高阶组件。
export default function createListView(type) {
  return {
    name: `${type}-stories-view`,

    // 异步获取list数据
    asyncData({
      store
    }) {
      return store.dispatch('FETCH_LIST_DATA', {
        type
      })
    },

    title: camelize(type),

    render(h) {
      return h(ItemList, {
        props: {
          type
        }
      })
    }
  }
}