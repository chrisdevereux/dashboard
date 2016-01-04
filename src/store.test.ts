import {expect} from 'chai'
import * as Actions from './actions'
import * as Store from './store' 

describe('toggle-disclosed', () => {
  it('should set undisclosed node state to disclosed', () => {
    const state = dispatchActions(
      Actions.toggleDisclosed(['foo', 'bar'])
    )
    expect(Store.selectDisclosure(state)).to.eql({
      foo: {bar: {}}
    })
  })
  
  it('should set disclosed node state to undisclosed', () => {
    const state = dispatchActions(
      Actions.toggleDisclosed(['foo', 'bar']),
      Actions.toggleDisclosed(['foo', 'bar'])
    )
    expect(Store.selectDisclosure(state)).to.eql({
      foo: {bar: undefined}
    })
  })
})

describe('set-config', () => {
  it('should set config', () => {
    const state = dispatchActions(
      Actions.setConfig({reports: []})
    )
    expect(Store.selectConfig(state)).to.eql({
      reports: []
    })
  })
})

describe('tree state', () => {
  it('should merge configuration with disclosure state', () => {
    const renderCell = () => 'foo'
    const getKey = () => 'foo'
    
    const state = dispatchActions(
      Actions.setConfig({
        reports: [
          {
            title: 'My Report',
            datasourceID: 'fooDatasource',
            columns: [],
            groups: [
              {
                title: 'first',
                fieldID: 'a',
                renderCell,
                getKey
              },
              {
                title: 'second',
                fieldID: 'b',
                renderCell,
                getKey
              }
            ]
          }
        ]
      }),
      Actions.toggleDisclosed(['a'])
    )
    
    expect(Store.selectTreeState(state, {reportIndex: 0})).to.eql({
      values: undefined,
      renderPrimaryCell: renderCell,
      getKey,
      queryString: '',
      children: {
        a: {
          values: undefined,
          renderPrimaryCell: renderCell,
          getKey,
          queryString: '',
          children: null
        }
      }
    })
  })
})

function dispatchActions(...actions: Actions.AnyAction[]) : Store.AppState {
  const initAction: any = {}
  return actions.reduce(Store.reduceApp, Store.reduceApp(undefined, initAction))
}
