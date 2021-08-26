import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'
import createPersistedState from 'vuex-persistedstate'

import app from './app'
import auth from './auth'

import type from './type'
import interest from './interest'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      app,
      auth,
      type,
      interest,
    },
    mutations: {
      ...vuexfireMutations
    },
    plugins: [createPersistedState()],
    strict: process.env.DEBUGGING
  })

  return Store
}
