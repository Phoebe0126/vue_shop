import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login'
const Login = () => import(/* webpackChunkName: "group-login" */ '../components/Login.vue')
// import Home from '../components/Home'
const Welcome = () => import(/* webpackChunkName: "group-welcome" */ '../components/Welcome.vue')
// import Welcome from '../components/Welcome'
// import Users from '../components/Users'
const Home = () => import(/* webpackChunkName: "group-welcome" */'../components/Home.vue')
const Users = () => import(/* webpackChunkName: "group-users" */ '../components/Users.vue')
// import Rights from '../components/Rights'
const Rights = () => import(/* webpackChunkName: "group-rights" */ '../components/Rights.vue')
// import Roles from '../components/Roles'
const Roles = () => import(/* webpackChunkName: "group-rights" */ '../components/Roles.vue')
// import Category from '../components/Category'
// import Params from '../components/Params'
const Category = () => import(/* webpackChunkName: "group-cate" */ '../components/Category.vue')
const Params = () => import(/* webpackChunkName: "group-cate" */ '../components/Params.vue')
// import Goods from '../components/Goods'
// import Add from '../components/Add'
const Goods = () => import(/* webpackChunkName: "group-goods" */ '../components/Goods.vue')
const Add = () => import(/* webpackChunkName: "group-goods" */ '../components/Add.vue')
// import Orders from '../components/Orders'
const Orders = () => import(/* webpackChunkName: "group-orders" */ '../components/Orders.vue')
// import Reports from '../components/Reports'
const Reports = () => import(/* webpackChunkName: "group-reports" */ '../components/Reports.vue')
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
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token强制跳转
  if (!tokenStr) return next('/login')
  next()
})
export default router
