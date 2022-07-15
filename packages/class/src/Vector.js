export class Vector extends Array {
  constructor(length = 0) {
    super(length)
  }
  remove(item) {
    const index = this.indexOf(item)
    if (index === -1) return false
    this.splice(index, 1)
    return true
  }
}