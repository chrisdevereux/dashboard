import * as ReduxThunk from 'redux-thunk'
import {combineReducers} from 'redux'
import {createSelector} from 'reselect'

import {TreeNode, RowData, QueryResolver} from './types'
import {mapDictionary} from './util'

export type DisplayStoreAction = ShapeChanged|QuerySubmitted|QueryResolved
type ShapeChanged = {type: string, shape: TreeNode}
type QuerySubmitted = {type: string, queryString: string}
type QueryResolved = {type: string, queryString: string, response: RowData[]}

type Thunk = (dispatch: (action: DisplayStoreAction) => void, getState: () => DisplayState) => Promise<any>


/**
 * ACTIONS
 */

/** 
 * Update the display state with the new tree shape, sumbitting any queries
 * needed to populate the tree view.
 */ 
export function shapeChanged(shape: TreeNode, resolveQuery: QueryResolver): Thunk {
  return (dispatch, getState) => {
    if (!shape) return Promise.resolve()
    
    dispatch({type: 'shape-changed', shape})
    
    const todo = selectUnsubmittedQueries(getState()).map(queryString => {
      dispatch({type: 'query-submitted', queryString})
      
      return resolveQuery(queryString).then(response => {
        dispatch({type: 'query-resolved', queryString, response})
      })
    })
    
    return Promise.all(todo)
  }
}

function isShapeChanged(action: DisplayStoreAction): action is ShapeChanged {
  return action.type && action.type == 'shape-changed'
}
function isQuerySubmitted(action: DisplayStoreAction): action is QuerySubmitted {
  return action.type && action.type == 'query-submitted'
}
function isQueryResolved(action: DisplayStoreAction): action is QueryResolved {
  return action.type && action.type == 'query-resolved'
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
 
 
 /** Data store reducers */
export const reducer: Reducer<DisplayState> = combineReducers({
  shape: createReducer<TreeNode>(null, (prev, action) => {
    if (isShapeChanged(action)) {
      return action.shape
      
    } else {
      return prev
    }
  }),
  
  data: createReducer<DataStore>({}, (prev, action) => {
    if (isQuerySubmitted(action)) {
      return Object.assign({}, prev, {[action.queryString]: null})
      
    } else if (isQueryResolved(action)) {
      return Object.assign({}, prev, {[action.queryString]: action.response})
      
    } else {
      return prev
    }
  })
})


/**
 * SELECTORS
 */

const selectData = ({data}: DisplayState) => data
const selectShape = ({shape}: DisplayState) => shape

/** Combine a subtree with the relevant data */
function populateData(shape: TreeNode, data: DataStore): TreeNode {
  return Object.freeze(
    Object.assign({}, shape, {
      values: data[shape.queryString],
      children: mapDictionary(shape.children, (child: TreeNode) => populateData(child, data))
    })
  )
}

/** Recurse through the tree, returning all queryStrings unknown to data */
function populateUnsubmittedQueries(shape: TreeNode, data: DataStore): string[] {
  const childQueries = Object.keys(shape.children || {})
    .map(key => populateUnsubmittedQueries(shape.children[key], data))

  const flattenedChildren = [].concat.apply([], childQueries)
  
  if (shape.queryString in data) {
    return flattenedChildren
      
  } else {
    return [shape.queryString, ...flattenedChildren]
  }
}

/** Merge the display tree with the available data */
export const selectDisplayTree = createSelector(
  selectShape, selectData,
  populateData
)

/** Return the set of queries we need to display the tree in its current state */
export const selectUnsubmittedQueries = createSelector(
  selectShape, selectData,
  populateUnsubmittedQueries
)



/**
 *  UTILS
 */

type Reducer<T> = (prev: T, action: DisplayStoreAction) => T

/** Utility for guaranteeing (shallow) immutability of state returned from reducer*/
function createReducer<T>(start: T, reduce: Reducer<T>): Reducer<T> {
  return (prev, action) => Object.freeze(reduce(prev || Object.freeze(start), action))
}
