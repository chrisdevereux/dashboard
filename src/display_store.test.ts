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

describe('selectUnsubmittedQueries', () => {
  it('should return query strings with no corresponding data entry', () => {
    const state: Store.DisplayState = {
      data: {
        'resolved': [],
        'pending': null
      },
      shape: {
        values: null,
        queryString: 'resolved',
        renderPrimaryCell: undefined,
        getKey: undefined,
        children: {
          a: {
            values: null,
            queryString: 'unsubmitted',
            renderPrimaryCell: undefined,
            getKey: undefined,
            children: null
          },
          b: {
            values: null,
            queryString: 'pending',
            renderPrimaryCell: undefined,
            getKey: undefined,
            children: null
          }
        },
      }
    }
    
    expect(Store.selectUnsubmittedQueries(state)).to.eql([
      'unsubmitted'
    ])
  })
})

const stubData: RowData[] = [ 
  {
    groupBy: {},
    sum: {}
  }
]

const stubQuery: QueryResolver = () => Promise.resolve(stubData)
