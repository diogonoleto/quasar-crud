/** Class representing a User. */
export default class Address {
  id = ''
  active = true
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
