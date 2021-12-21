import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/login/login.vue'
import Register from '../views/register/Register.vue'
import Forgetpassword from '../views/forgetpassword/Forgetpass.vue'
import Forgetpassword_recoverycode from '../views/forgetpassword/Forgetpass_recovery.vue'
import Forgetpassword_newpassword from '../views/forgetpassword/Forgerpass_newpassword.vue'
import Overviews from '../views/overview/Overviews.vue'
import Resident from '../views/table/Resident.vue'
import Electric from '../views/table/Electric.vue'
import Water from '../views/table/Water.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    componentin: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/forgetpass',
    name: 'Forgetpassword',
    component: Forgetpassword
  },
  {
    path: '/recovery',
    name: 'Forgetpassword_recoverycode',
    component: Forgetpassword_recoverycode
  },
  {
    path: '/newpassword',
    name: 'Forgetpassword_newpassword',
    component: Forgetpassword_newpassword
  },
  {
    path: '/overview',
    name: 'overview',
    component: Overviews
  },
  {
    path: '/residents',
    name: 'resident',
    component:Resident
  },
  {
    path: '/electricbill',
    name: 'Electrics',
    component: Electric
  },
  {
    path: '/waterbill',
    name: 'Water',
    component: Water
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// set หน้าแรกที่เข้า
router.replace('/login');

export default router
