import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getDatabase, ref, get } from 'firebase/database'

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

// Helper to wait for auth to initialize
function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      user => {
        unsubscribe()
        resolve(user)
      },
      reject
    )
  })
}

// Route Guard
router.beforeEach(async (to, from, next) => {
  console.log("Navigating to:", to.fullPath)

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  try {
    const user = await getCurrentUser()
    console.log("Current user:", user)

    if (requiresAuth && !user) {
      console.log("Not logged in, redirecting")
      return next('/') // redirect to home
    }

    if (requiresAdmin) {
      console.log("Checking admin role...")
      const db = getDatabase()
      const roleSnapshot = await get(ref(db, `users/${user.uid}/role`))
      const role = roleSnapshot.val()
      console.log("User role:", role)

      if (role === 'ADMIN') {
        console.log("Access granted")
        return next()
      } else {
        console.log("Not an admin, redirecting")
        return next('/')
      }
    }

    console.log("No auth/admin required, proceeding")
    return next()
  } catch (error) {
    console.error("Route guard error:", error)
    return next('/')
  }
})


export default router
