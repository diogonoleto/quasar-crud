import firebase from 'firebase/app'
import 'firebase/auth'

/**
 * https: //firebase.google.com/docs/reference/js/firebase.auth.Auth.html#create-user-with-email-and-password
 *
 * @param {String} email - A Valid email
 * @param {String} password - Password
 *
 * @return {Promise} UserCredentials
 */
export const createUserWithEmail = async (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}

/**
 * remove firebase auth token
 */
export const logoutUser = () => {
  return firebase.auth().signOut()
}

/**
 * @param {String} email - A Valid email
 * @param {String} password - Password
 *
 * @return {Promist} UserCredentials
 */
export const loginWithEmail = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
}

export const loginWithFacebook = () => {
  var provider = new firebase.auth.FacebookAuthProvider();
  return firebase.auth().signInWithPopup(provider)
}

