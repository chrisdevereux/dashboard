import {expect} from 'chai'
import * as Actions from './actions'
import * as Store from './store' 

const renderCell = () => 'foo'
const getKey = () => 'foo'

describe('toggle-disclosed', () => {
  it('should set undisclosed node state to disclosed', () => {
    const state = dispatchActions(
      Actions.toggleDisclosed(['"foo"', '"bar"'])
    )
    expect(Store.selectDisclosure(state)).to.eql({
      '"foo"': {'"bar"': {}}
    })
  })
  
  it('should set disclosed node state to undisclosed', () => {
    const state = dispatchActions(
      Actions.toggleDisclosed(['"foo"', '"bar"']),
      Actions.toggleDisclosed(['"foo"', '"bar"'])
    )
    expect(Store.selectDisclosure(state)).to.eql({
      '"foo"': {}
    })
  })
})

describe('set-config', () => {
  it('should set config', () => {
    const state = dispatchActions(
      Actions.setConfig({apiKey: '', reports: []})
    )
    expect(Store.selectConfig(state)).to.eql({
      apiKey: '',
      reports: []
    })
  })
})

describe('tree state', () => {
  it('should return null prior to config loading', () => {
    const state = dispatchActions()
    expect(Store.selectTreeState(state, {reportIndex: 0})).to.be.null
  })
  
  it('should merge configuration with disclosure state', () => {
    const state = dispatchActions(
      Actions.setConfig({
        apiKey: '',
        reports: [
          {
            title: 'My Report',
            datasourceID: 'ds',
            columns: [
              {
                title: '',
                fieldID: 'val',
                renderCell
              }
            ],
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
      Actions.toggleDisclosed(['"a1"'])
    )
    
    expect(Store.selectTreeState(state, {reportIndex: 0})).to.eql({
      values: undefined,
      renderPrimaryCell: renderCell,
      getKey,
      queryString: `SELECT 'a', SUM('val') FROM ds GROUP BY 'a'`,
      children: {
        '"a1"': {
          values: undefined,
          renderPrimaryCell: renderCell,
          getKey,
          queryString: `SELECT 'b', SUM('val') FROM ds WHERE 'a' = 'a1' GROUP BY 'b'`,
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
