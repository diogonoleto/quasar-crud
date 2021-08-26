module.exports = function (/* ctx */) {
  return {
    supportTS: false,
    boot: [
      'currency',
      'filters',
      'firebase',
      'money',
      'vuelidate',
      'function'
    ],
    css: [
      'app.scss'
    ],
    extras: [
      'mdi-v5',
      'fontawesome-v5',
      'roboto-font',
      'material-icons',
      // 'ionicons-v4',
      // 'eva-icons',
      // 'themify',
      'line-awesome',
      // 'roboto-font-latin-ext',
    ],
    build: {
      vueRouterMode: 'history', // available values: 'hash', 'history'
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })
      },
    },
    devServer: {
      https: false,
      port: 8080,
      open: true
    },
    framework: {
      iconSet: 'material-icons',
      lang: 'pt-br',
      config: {},
      cssAddon: true,
      importStrategy: 'auto',
      plugins: ['Loading', 'Notify', 'AppFullscreen', 'BottomSheet'],
      config: {
        notify: {
          position: 'top-right'
        }
      }
    },
    animations: [],
    ssr: {
      pwa: false
    },
    pwa: {
      workboxPluginMode: 'GenerateSW',
      workboxOptions: {},
      manifest: {
        name: `Crud`,
        short_name: `Crud`,
        description: `Crud`,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },
    cordova: {
      id: 'dns.processo.com'
    },
    capacitor: {
      hideSplashscreen: true
    },
    electron: {
      bundler: 'packager',
      packager: {
      },
      builder: {
        appId: 'processo'
      },
      nodeIntegration: true,
      extendWebpack (/* cfg */) {
      }
    }
  }
}
