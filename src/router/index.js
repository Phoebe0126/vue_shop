import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/Users'
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
    component: Home,
    // 重定向到welcome
    redirect: '/welcome',
    children: [{
      // 在Home中嵌套welcome路由
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }]
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
