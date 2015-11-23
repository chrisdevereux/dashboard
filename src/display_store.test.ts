import {expect} from 'chai'
import {createStore, applyMiddleware} from 'redux'
import thunk = require('redux-thunk')
import * as Store from './display_store' 

describe('update-shape', () => {
  it('should combine ', () => {
    const store = createStore(Store.reducer, applyMiddleware(thunk))
    
    return store.dispatch(
      Store.shapeChanged({
        values: undefined,
        children: {},
        queryString: 'foo',
        renderPrimaryCell: undefined,
        getKey: undefined
      })
    ).then(() => {
      expect(Store.selectDisplayTree(store.getState())).to.eql({
        values: undefined,
        children: {},
        queryString: 'foo',
        renderPrimaryCell: undefined,
        getKey: undefined
      })
    })
  })
})
