// From https://stackoverflow.com/a/66353324/37147
import { computed, IComputedValueOptions } from "mobx"
import { DependencyList, useMemo } from "react"

// Changes to the "options" argument are ignored.
export const useComputed = <T>(
  func: () => T,
  options?: IComputedValueOptions<T>,
  deps?: DependencyList
) => {
  return useMemo(() => computed(func, options), deps ?? []).get()
}
