
// 引入 ECharts 主模块
// 引入折线图
// 引入提示框和标题组件等
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/toolbox'

import './element/index.js'

import Vue from 'vue'
import App from './App.vue'

import store from './store/index.js'
import router from './router/index.js'

import ipc from './ipc/index.js'

import { version } from '../../package.json'
import github from './github.js'

Vue.prototype.$$ipc = ipc
Vue.prototype.$$echarts = echarts

/**
 * 关闭生产模式下给出的提示
 */
Vue.config.productionTip = false

document.title = `bigproject monitor ${version}`
/**
 * 检查版本
 */
github().then(res => {
  store.commit('setGithub', res)

  if (res.tag_name !== version) {
    router.replace('github')
  }
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
