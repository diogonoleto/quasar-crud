export default class Interest {
  id = ''
  active = true
  deleted_at = null
  created_at = new Date()

  constructor(args) {
    Object.keys(args).forEach((v, i) => {
      this[v] = args[v]
    })
    return {
      ...this
    }
  }
}
