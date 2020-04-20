import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/Users'
import Rights from '../components/Rights'
import Roles from '../components/Roles'
import Category from '../components/Category'
import Params from '../components/Params'
import Goods from '../components/Goods'
import Add from '../components/Add'
import Orders from '../components/Orders'
import Reports from '../components/Reports'
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
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/categories',
      component: Category
    }, {
      path: '/params',
      component: Params
    }, {
      path: '/goods',
      component: Goods
    }, {
      path: '/goods/add',
      component: Add
    }, {
      path: '/orders',
      component: Orders
    }, {
      path: '/reports',
      component: Reports
    }]
  }
]

const router = new VueRouter({
  routes
})
// 路由前置守卫
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
