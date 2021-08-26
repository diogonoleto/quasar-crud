import { firestoreAction } from 'vuexfire'
import User from 'src/models/User.js'

export const addUserToUsersCollection = async (state, ref) => {
  const user = new User(state)
  return ref.set(user)
}
export const createNewUser = async function (state, data) {
  const $fb = this.$fb
  const { email, password } = data
  const fbAuthResp = await $fb.createUserWithEmail(email, password)
  const id = fbAuthResp.user.uid
  const ref = $fb.getById('users', id)
  return addUserToUsersCollection({ email, id }, ref)
}
export const loginUser = async function ({ }, payload) {
  const $fb = this.$fb
  const { email, password } = payload
  return $fb.loginWithEmail(email, password)
}

export const loginFacebook = async function ({ }) {
  const $fb = this.$fb
  const fbAuthResp = await $fb.loginWithFacebook()
  const user = {
    id: fbAuthResp.user.uid,
    email: fbAuthResp.user.email,
    name: fbAuthResp.user.displayName,
    photo: fbAuthResp.user.photoURL + `?access_token=${fbAuthResp.credential.accessToken}`,
  }
  const ref = $fb.getById('users', user.id)
  return addUserToUsersCollection(user, ref)
}

export const logoutUser = async function ({ commit }, payload) {
  await firestoreAction(({ unbindFirestoreRef }) => { unbindFirestoreRef('users') })

  commit('app/setCurrent', {}, { root: true })
  commit('appointment/setList', {}, { root: true })
  commit('patient/setList', {}, { root: true })
  commit('profissional/setList', {}, { root: true })

  this.$fb.logoutUser()
}
export function routeUserToAuth () {
  this.$router.push({
    path: '/auth/login'
  })
}
