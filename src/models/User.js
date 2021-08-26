export default class User {
  id = ''
  active = true
  level = 1
  deleted_at = null
  created_at = new Date()

  constructor(args) {
    Object.keys(args).forEach((v, i) => {
      this[v] = args[v].trim()
    })
    return {
      ...this
    }
  }
}
