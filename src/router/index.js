import { createRouter, createWebHistory } from 'vue-router'
import BrowseView from '@/views/BrowseView.vue'

const routes = [
  {
    path: '/',
    name: 'browse',
    component: BrowseView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/UserView.vue')
  },
  {
    path: '/favourites',
    name: 'favourites',
    component: () => import('../views/FavouritesView.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
