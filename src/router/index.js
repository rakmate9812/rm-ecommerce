import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';

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

// Route Guard
router.beforeEach((to, from, next) => {
  const user = store.state.user.user;
  const role = store.state.user.role;

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (to.path === '/favourites' && !user) {
    store.commit('modal/showModal', 'A kedvencek eléréséhez be kell jelentkezz!');
    return;
  }

  if (requiresAuth && !user) {
    return next('/');
  }

  if (requiresAdmin) {
    if (role === 'ADMIN') {
      return next();
    } else {
      return next('/');
    }
  }

  return next();
});




export default router
