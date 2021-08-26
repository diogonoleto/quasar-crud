
import firebase from 'firebase/app'
import 'firebase/auth'

import { Notify } from 'quasar'

export const self = () => {
  return firebase
}

export const fBInit = (config) => {
  return firebase.initializeApp(config)
}

export const auth = () => {
  return firebase.auth()
}

export const ensureAuthIsInitialized = (store) => {
  if (store.state.auth.isReady) return true
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
      resolve()
      unsubscribe()
    }, () => {
      reject(new Error('Parece que há um problema com o serviço firebase. Por favor, tente novamente mais tarde'))
    })
  })
}

export const handleOnAuthStateChanged = async (store, one, router) => {
  const initialAuthState = isAuthenticated(store)
  store.commit('auth/setAuthState', {
    isAuthenticated: one !== null,
    isReady: true,
    uid: (one ? one.uid : '')
  })
  if (store.state.auth.isAuthenticated) {
    await store.dispatch('app/currentGet', one.uid)
  }
  if (!one && initialAuthState) {
    store.dispatch('auth/routeUserToAuth')
  }
}

export const isAuthenticated = (store) => {
  return store.state.auth.isAuthenticated
}

/**
 * remove firebase auth token
 */
export const logoutUser = () => {
  return auth().signOut()
}

/**
 * @param  {Object} router - Vue Router
 * @param  {Object} store - Vuex Store
 */
export const routerBeforeEach = async (router, store) => {
  router.beforeEach(async (to, from, next) => {
    try {
      await ensureAuthIsInitialized(store)
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (isAuthenticated(store)) {
          if (!store.state.app.current.name) {
            store.commit('app/setDialogProfile', true)
          }
          next()
        } else {
          next('/auth/login')
        }
      } else if ((to.path === '/auth/register' && isAuthenticated(store)) ||
        (to.path === '/auth/login' && isAuthenticated(store))) {
        next('/')
      } else {
        next()
      }
    } catch (err) {
      Notify.create({
        message: `ROUTER BEFORE EACH: ${err}`,
        color: 'negative'
      })
    }
  })
}
