import * as Actions from './actions'

export type AppState = {
  disclosure: DisclosureState
}

export const reduceApp = createReducer(null, (prev: AppState, action: Actions.AnyAction) => ({
  disclosure: reduceDisclosure(prev && prev.disclosure, action)
}))



/**
 *  DISCLOSURE STATE
 */


/** Tree identifying the subset of keypaths that are disclosed */
type DisclosureState = {
  /** disclosure state of the child key identified by `index` */
  [index: string]: DisclosureState
}

/** Return the app's current disclosure tree **/
export function selectDisclosure(state: AppState): DisclosureState {
  return state.disclosure
}

/** Disclosure update function */
const reduceDisclosure: Reducer<DisclosureState> = createReducer<DisclosureState>({}, (prev, action) => {
  if (Actions.isToggleDisclosed(action)) {
    // Recurse through the expansion tree, replacing the node identified by `keypath`
    // with null (to collapse) or an empty child map (to expand) 
   
    if (action.keypath.length === 0) {
      throw Error('ToggleExpanded action: .keypath must not be empty')
      
    } else if (action.keypath.length === 1) {
      const key = action.keypath[0]
      
      if (prev[key]) {
        return Object.assign({}, prev, {[key]: undefined})
        
      } else {
        return Object.assign({}, prev, {[key]: {}})
      }
      
    } else {
      const [head, ...tail] = action.keypath
      const childAction = Object.assign({}, action, {keypath: tail})
      
      return Object.assign({}, prev, {
        [head]: reduceDisclosure(prev[head], childAction)
      })
    }
    
  } else {
    return prev
  }
})


/**
 *  UTILS
 */

type Reducer<T> = (prev: T, action: Actions.AnyAction) => T

/** Utility for guaranteeing (shallow) immutability of state returned from reducer*/
function createReducer<T>(start: T, reduce: Reducer<T>): Reducer<T> {
  return (prev, action) => Object.freeze(reduce(prev || Object.freeze(start), action))
}
