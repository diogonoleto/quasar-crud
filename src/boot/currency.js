import currency from 'vue-currency-filter'

export default ({ Vue }) => {
  Vue.use(currency, {
    symbol: 'R$',
    thousandsSeparator: '.',
    fractionCount: 2,
    fractionSeparator: ',',
    symbolPosition: 'front',
    symbolSpacing: true
  })
}
