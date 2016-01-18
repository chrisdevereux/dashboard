import {expect} from 'chai'
import {createStore, applyMiddleware} from 'redux'
import thunk = require('redux-thunk')

import {RowData, QueryResolver} from './types'
import * as Store from './display_store' 

describe('update-shape', () => {
  it('should do nothing when tree shape is null', () => {
    const store = createStore(Store.reducer, applyMiddleware(thunk))
    return store.dispatch(
      Store.shapeChanged(null, stubQuery)
    )
  })
  
  it('should update display tree shape when query submitted, then data when query resolves', () => {
    const store = createStore(Store.reducer, applyMiddleware(thunk))
    const resolveQuery = store.dispatch(
      Store.shapeChanged({
        values: undefined,
        children: {},
        queryString: 'foo',
        renderPrimaryCell: undefined,
        getKey: undefined
      }, stubQuery)
    );
    
    expect(Store.selectDisplayTree(store.getState())).to.eql({
      values: null,
      children: {},
      queryString: 'foo',
      renderPrimaryCell: undefined,
      getKey: undefined
    })
      
    return resolveQuery.then(() => {
      expect(Store.selectDisplayTree(store.getState())).to.eql({
        values: stubData,
        children: {},
        queryString: 'foo',
        renderPrimaryCell: undefined,
        getKey: undefined
      })
    })
  })
})

const stubData: RowData[] = [ 
  {
    groupBy: {},
    sum: {}
  }
]

const stubQuery: QueryResolver = () => Promise.resolve(stubData)
