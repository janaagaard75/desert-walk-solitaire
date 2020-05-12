// It is generally discouraged to extend the prototypes of the built in classes, but extending the classes or wrapping them would require a lot of casting or boxing/unboxing. Note this about extending built ins: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work.

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
    /** Return a shallow copy of the array. */
    clone(): Array<T>
    /** Return a shuffled shallow copy of the array. */
    shuffle(): Array<T>
  }

  interface ReadonlyArray<T> {
    /** Return a shallow copy of the array. */
    clone(): ReadonlyArray<T>
    /** Return a shuffled shallow copy of the array. */
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

export {}
