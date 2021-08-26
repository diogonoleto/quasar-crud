import firebaseService from '../services/firebase'

export default ({ router, store, Vue }) => {

  firebaseService.fBInit({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATA_BASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  })

  firebaseService.auth().onAuthStateChanged((one) => {
    firebaseService.handleOnAuthStateChanged(store, one)
  }, (error) => {
    console.error(error)
  })

  firebaseService.routerBeforeEach(router, store)

  Vue.prototype.$fb = firebaseService
  store.$fb = firebaseService
}
