export const shuffleArray = <T>(array: ReadonlyArray<T>): ReadonlyArray<T> => {
  const clone = array.slice(0);
  let top = clone.length;
  while (--top >= 1) {
    const current = Math.floor(Math.random() * (top + 1));
    const temporaryElement = clone[current];
    clone[current] = clone[top];
    clone[top] = temporaryElement;
  }
  return clone;
};
