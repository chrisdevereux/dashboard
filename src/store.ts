import {createSelector} from 'reselect'

import * as SQL from './sql'
import * as Actions from './actions'
import {ConfigDescriptor, GroupDescriptor, TreeNode, FilterType} from './types'
import {mapDictionary} from './util'

export type AppState = {
  disclosure: DisclosureState,
  config: ConfigDescriptor
}

export const reduceApp = createReducer(null, (prev: AppState, action: Actions.AnyAction) => ({
  disclosure: reduceDisclosure(prev && prev.disclosure, action),
  config: reduceReportConfig(prev && prev.config, action)
}))


/**
 * TREE STATE
 */

export const selectTreeState = createSelector(
  selectDisclosure, selectConfig, selectReportIndex,
  
  (disclosue: DisclosureState, config: ConfigDescriptor, reportIndex: number) => {
    const report = config.reports[reportIndex]
    return getNode(disclosue, [], report.groups, report.datasourceID)
  }
)

function getNode(disclosure: DisclosureState, keypath: string[], groups: GroupDescriptor[], datasource: string): TreeNode {
  const [group, ...restGroups] = groups
  
  const expandable = restGroups.length > 0
  const getChildren = () =>
    mapDictionary(disclosure, (child, key) => 
      getNode(child, [...keypath, key], restGroups, datasource)
    )
  
  return {
    values: undefined,
    children: expandable ? getChildren() : null,
    getKey: group.getKey,
    renderPrimaryCell: group.renderCell,
    queryString: ''
  }
}



/**
 * CONFIG STATE
 */

export function selectConfig(state: AppState): ConfigDescriptor {
  return state.config
}

export function selectReportIndex(_: {}, props: {reportIndex: number}): number {
  return props.reportIndex
}

const reduceReportConfig = createReducer<ConfigDescriptor>({reports: []}, (prev, action) => {
  if (Actions.isSetConfig(action)) {
    return action.config
    
  } else {
    return prev
  }
})




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
