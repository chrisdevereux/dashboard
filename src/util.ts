type Dictionary<T> = {[index: string]: T}

/** Map a dictionary object with homogenous values */
export function mapDictionary<T, Out>(prev: Dictionary<T>, fn: (child: T, key: string) => Out): Dictionary<Out> {
  if (!prev) return null
  const next: Dictionary<Out> = {}
  
  Object.keys(prev).forEach(key => {
    next[key] = fn(prev[key], key)  
  })
  
  return next
}
