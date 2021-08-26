
const routes = [
  { //perfil
    path: '/',
    component: () => import('layouts/Main'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'profile', component: () => import('pages/Index') },
      { path: 'tipo', name: 'type', component: () => import('pages/Index') },
      { path: 'interessado', name: 'interest', component: () => import('pages/Index') },
    ]
  },
  { //auth
    path: '/auth',
    redirect: 'auth/login',
    component: () => import('layouts/Auth'),
    children: [
      { path: 'forgotPassword', name: 'ForgotPassword', component: () => import('pages/auth/ForgotPassword') },
      { path: 'login', name: 'Login', component: () => import('pages/auth/Auth') },
      { path: 'register', name: 'Register', component: () => import('pages/auth/Auth') }
    ]
  },
  { //error 404
    path: '*',
    component: () => import('pages/error/404')
  }
]

export default routes
