export class CycleMap {
  #key2value = new Map()
  #value2key = new Map()
  get(keyOrValue, byKey = true) {
    const map = byKey ? this.#key2value : this.#value2key
    return map.get(keyOrValue)
  }
  set(key, value) {
    this.#key2value.set(key, value)
    this.#value2key.set(value, key)
  }
  delete(keyOrValue, byKey = true) {
    const [key, value] = byKey
      ? [keyOrValue, this.#key2value.get(keyOrValue)]
      : [this.#value2key.get(keyOrValue), keyOrValue]
    this.#key2value.delete(key)
    this.#value2key.delete(value)
  }
  has(keyOrValue, byKey = true) {
    const map = byKey ? this.#key2value : this.#value2key
    return map.has(keyOrValue)
  }
}
