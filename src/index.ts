import { App } from 'vue'  
import type { Plugin } from '@vue/runtime-core'
import DraggableTable from './components/DraggableTable.vue'
import './styles/index.css'

export interface DraggableTableOptions {
  componentName?: string
  globalStyles?: boolean
}

const plugin: Plugin = {
  install(app: App, options: DraggableTableOptions = {}) {
    app.component(options.componentName || 'DraggableTable', DraggableTable)
    
    if (options.globalStyles !== false) {
      import('./styles/index.css')
    }
  }
}

export default plugin
export { DraggableTable}

// 移除以下自动安装代码，因为Vue 3不再支持window.Vue
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(plugin)
// }