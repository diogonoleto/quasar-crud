export default {
  title: 'SYS',
  dialog: false,
  dialogProfile: false,
  drawer: false,
  header: {
    title: '',
    subtitle: '',
    route: '/'
  },
  menu: {
    top: [
      {
        title: 'Home',
        icon: 'home',
        link: '/'
      },
    ],
    user: [
      { icon: 'settings', text: 'Configurações', route: '/perfil' },
    ]
  },
  current: {},
  addresses: {},
}

