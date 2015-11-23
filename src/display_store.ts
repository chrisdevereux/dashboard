import * as ReduxThunk from 'redux-thunk'
import {combineReducers} from 'redux'
import {createSelector} from 'reselect'
import {TreeNode, RowData} from './types'

export type DisplayStoreAction = ShapeChanged
type ShapeChanged = {type: string, shape: TreeNode}

type Thunk = (dispatch: (action: DisplayStoreAction) => void, getState: () => DisplayState) => Promise<any>


/**
 * ACTIONS
 */

export function shapeChanged(shape: TreeNode): Thunk {
  return (dispatch, getState) => {
    dispatch({type: 'shape-changed', shape})
    
    return Promise.resolve()
  }
}

function isShapeChanged(action: DisplayStoreAction): action is ShapeChanged {
  return action.type && action.type == 'shape-changed'
}



/**
 * Display tree state.
 * 
 * This is kept in a separate state tree to the main app state because we consider it to
 * be derived state. Our canonical state is the user's filter, search & pivot selections.
 * 
 * Given the requested shape and content of the display tree, this store dispatches querys
 * to the server and merges responses with the requested tree to produce the final rendered
 * display tree. 
 **/
export type DisplayState = {
  data: DataStore
  shape: TreeNode
}

type DataStore = {[index: string]: RowData[]}
 
 
export const reducer: Reducer<DisplayState> = combineReducers({
  shape: createReducer<TreeNode>(null, (prev, action) => {
    if (isShapeChanged(action)) {
      return action.shape
      
    } else {
      return prev
    }
  }),
  
  data: createReducer<DataStore>({}, (prev, action) => {
    return prev
  })
})


/**
 * SELECTORS
 */

const selectData = ({data}: DisplayState) => data
const selectShape = ({shape}: DisplayState) => shape

function populateData(shape: TreeNode, data: DataStore): TreeNode {
  return Object.freeze(
    Object.assign({}, shape, {
      values: data[shape.queryString],
      children: mapChildren(shape.children, child => populateData(child, data))
    })
  )
}

/** Combine tree shape with fetched data */
export const selectDisplayTree = createSelector(
  selectShape, selectData,
  populateData
)



/**
 *  UTILS
 */

type Reducer<T> = (prev: T, action: DisplayStoreAction) => T

/** Utility for guaranteeing (shallow) immutability of state returned from reducer*/
function createReducer<T>(start: T, reduce: Reducer<T>): Reducer<T> {
  return (prev, action) => Object.freeze(reduce(prev || Object.freeze(start), action))
}

function mapChildren(children: {[index: string]: TreeNode}, fn: (node: TreeNode, key: string) => TreeNode): {[index: string]: TreeNode} {
  if (!children) return children
  
  const next: {[index: string]: TreeNode} = {}
  Object.keys(children).forEach(key => {
    next[key] = fn(children[key], key)  
  })
  
  return next
}
