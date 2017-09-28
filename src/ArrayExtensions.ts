// TODO: Consider creating an ExtendedArray class instead.

function shuffleInPlace<T>(array: Array<T>): void {
  let top = array.length
  if (top >= 0) {
    while (--top) {
      const current = Math.floor(Math.random() * (top + 1))
      const temporaryElement = array[current]
      array[current] = array[top]
      array[top] = temporaryElement
    }
  }
}

declare global {
  interface Array<T> {
    clone(): Array<T>
    shuffle(): Array<T>
  }

  interface ReadonlyArray<T> {
    clone(): ReadonlyArray<T>
    shuffle(): ReadonlyArray<T>
  }
}

// Deliberately not using fat arrow syntax here.

if (!Array.prototype.clone) {
  Array.prototype.clone = function <T>(): Array<T> {
    return this.slice(0)
  }
}

if (!Array.prototype.shuffle) {
  Array.prototype.shuffle = function <T>(): Array<T> {
    const clone = this.clone()
    shuffleInPlace(clone)
    return clone
  }
}

export { }