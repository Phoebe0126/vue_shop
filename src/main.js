import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 全局时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const date = new Date(originVal)
  const yy = date.getFullYear()
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const dd = (date.getDate() + '').padStart(2, '0')
  const hh = (date.getHours() + '').padStart(2, '0')
  const mm = (date.getMinutes() + '').padStart(2, '0')
  const ss = (date.getSeconds() + '').padStart(2, '0')

  return `${yy}/${m}/${dd} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false
Vue.component('TreeTable', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
