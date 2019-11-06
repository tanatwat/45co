import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Login from './views/_credential/Login.vue'
import Verify from './views/_credential/Verify.vue'
import Projects from './views/project/Projects.vue'
import ProjectPage from './views/project/Projects.vue'
import CreateProject from './views/project/CreateProject.vue'
import Clients from './views/client/Clients.vue'
import CreateClient from './views/client/CreateClient.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Dashboard,
      meta: { requiresAuth: true },
      beforeEnter: (to, from, next) => {
        var user = router.app.$auth.currentUser
        if(user) {
          if(!user.emailVerified) {
            next('/verify')
          } else {
            next()
          }
        } else {
          next('/login')
        }
      },
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        },
        {
          path: '/projects',
          component: Projects
        },
        {
          path: '/projects/board/:id',
          component: ProjectPage
        },
        {
          path: '/projects/create',
          component: CreateProject
        },
        {
          path: '/clients',
          component: Clients
        },
        {
          path: '/clients/create',
          component: CreateClient
        },
      ]
    },
    {
      path: '/login',
      component: Login,
      beforeEnter: (to, from, next) => {
        var user = router.app.$auth.currentUser
        if(user) {
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/verify',
      component: Verify,
      beforeEnter: (to, from, next) => {
        var user = router.app.$auth.currentUser
        if(user) {
          if(!user.emailVerified) {
            next()
          } else {
            next('/')
          }
        } else {
          next('/login')
        }
      }
    },
  ]
  
})

router.beforeEach((to, from, next) => {
  router.app.$root.loading = true
  next()
})

router.afterEach((to, from, next) => {
  router.app.$root.loading = false
})


export default router;