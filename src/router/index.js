import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import { auth } from '@/firebaseConfig'

import BrowseView from '@/views/BrowseView.vue'
import ProductView from '@/views/ProductView.vue'

const routes = [
  { path: '/', name: 'browse', component: BrowseView },
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/UserView.vue'),
  },
  {
    path: '/favourites',
    name: 'favourites',
    component: () => import('../views/FavouritesView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue'),
  },
  {
    path: '/products/:productId',
    name: 'product',
    component: ProductView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const firebaseUser = auth.currentUser // directly from firebase -> needed here
  const role = store.state.user.role
  // const vuexUser = store.state.user.user

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  if (to.path === '/favourites') {
    if (!firebaseUser || (firebaseUser && firebaseUser.isAnonymous)) {
      store.commit('modal/showModal', 'A kedvencek eléréséhez be kell jelentkezz!')
      return
    }
  }

  if (requiresAuth) {
    if (!firebaseUser || (firebaseUser && firebaseUser.isAnonymous)) {
      return next('/')
    }
  }

  if (requiresAdmin) {
    if (role === 'ADMIN') {
      return next()
    } else {
      return next('/')
    }
  }

  return next()
})

export default router
