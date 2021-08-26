import { date } from 'quasar'

export default ({ Vue }) => {
  Vue.filter('formatCep', (v) => {
    if (!v) return ""
    return v.replace(/^(\d{2})(\d{3})(\d{3})/, "$1.$2-$3")
  })
  Vue.filter('formatCNPJ', (v) => {
    if (!v) return ""
    return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  })
  Vue.filter('formatCPF', (v) => {
    if (!v) return ''
    return v.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  })
  Vue.filter('formatMobile', (v) => {
    if (!v) return ""
    return v.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  })
  Vue.filter('formatDate', (v, f) => {
    return v.seconds ? date.formatDate(v.seconds * 1000, f) : v
  })
  Vue.filter('formatNumber', (v, d = 2, prefix = '', suffix = '') => {
    if (!v) return prefix + v
    return prefix + new Intl.NumberFormat('pt-BR', {
      style: 'decimal', //decimal
      minimumFractionDigits: d,
      maximumFractionDigits: d,
      currencyDisplay: 'code'
    }).format(v) + suffix
  })
  Vue.filter('navatar', (v) => {
    if (!v) return '   '
    let fn = v.split(' ')
    let fn2 = fn.length > 1 ? fn[fn.length - 1].substr(0, 1).toUpperCase() : ''
    return (
      fn[0].substr(0, 1).toUpperCase() + fn2
    )
  })
}

