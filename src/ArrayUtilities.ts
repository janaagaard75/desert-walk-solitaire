export class ArrayUtilities {
  /** Shuffle the elements in an array in place. Based on http://stackoverflow.com/a/962890/37147. */
  public static shuffleArray<T>(array: Array<T>): void {
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
}