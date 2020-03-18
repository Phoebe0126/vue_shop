import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login'
import Home from '../components/Home'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  }, {
    path: '/',
    redirect: '/login'
  }, {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to表示将要访问的路径
  // from表示从哪个路径跳转
  // next表示放行, next('/login')强制跳转
  if (to.path === '/login') next()
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token强制跳转
  if (!tokenStr) return next('/login')
  next()
})

export default router
