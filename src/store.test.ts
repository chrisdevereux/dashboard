import {expect} from 'chai'
import * as Actions from './actions'
import * as Store from './store'
import {FilterType} from './types'

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

describe('set-report', () => {
  it('should set config', () => {
    const state = dispatchActions(
      Actions.setReport(2)
    )
    expect(Store.selectReportIndex(state)).to.eql(2)
  })
})

describe('report options', () => {
  it('should return available reports', () => {
    const state = dispatchActions(
      Actions.setConfig({
        apiKey: '',
        reports: [
          {
            title: 'Foo',
            datasourceID: '',
            columns: [],
            groups: [],
            globalFilters: []
          }
        ]
      })
    )
    
    expect(Store.selectReportOptions(state)).to.eql([
      {title: 'Foo', id: 0}
    ])
  })
})

describe('tree state', () => {
  it('should return null prior to config loading', () => {
    const state = dispatchActions()
    expect(Store.selectTreeState(state)).to.be.null
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
            ],
            globalFilters: [
              {lhs: 'foo', type: FilterType.equals, rhs: 'bar'}
            ]
          }
        ]
      }),
      Actions.toggleDisclosed(['"a1"'])
    )
    
    expect(Store.selectTreeState(state)).to.eql({
      values: undefined,
      renderPrimaryCell: renderCell,
      getKey,
      queryString: `SELECT 'a', SUM('val') FROM ds WHERE 'foo' = 'bar' GROUP BY 'a'`,
      children: {
        '"a1"': {
          values: undefined,
          renderPrimaryCell: renderCell,
          getKey,
          queryString: `SELECT 'b', SUM('val') FROM ds WHERE 'foo' = 'bar' AND 'a' = 'a1' GROUP BY 'b'`,
          children: null
        }
      }
    })
  })
})

describe('column state', () => {
  it('should return active report columns', () => {
    const state = dispatchActions(
      Actions.setConfig({
        apiKey: '',
        reports: [
          {
            title: '',
            groups: [],
            datasourceID: 'foo',
            columns: [
              {title: 'foo', fieldID: 'foo', renderCell}
            ],
            globalFilters: []
          }
        ]
      })
    )
    expect(Store.selectColumns(state)).to.eql([
      {title: 'foo', fieldID: 'foo', renderCell}
    ])
  })
})

function dispatchActions(...actions: Actions.AnyAction[]) : Store.AppState {
  const initAction: any = {}
  return actions.reduce(Store.reduceApp, Store.reduceApp(undefined, initAction))
}
