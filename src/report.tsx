import * as React from 'react'
import {createStore, applyMiddleware, Store as ReduxStore} from 'redux'
import thunk = require('redux-thunk')
import {connect, Provider} from 'react-redux'
import logger = require('redux-logger')
import {createStructuredSelector} from 'reselect'

import * as Store from './store'
import * as Actions from './actions'
import * as DisplayStore from './display_store'
import * as Fusion from './fusion_api'
import TreeView, {Column} from './tree_view'
import {TreeNode, ColumnDescriptor, RowData, QueryResolver} from './types'

type ReportProps = {
  // Store views
  treeState: TreeNode,
  columns: ColumnDescriptor[],
  apiKey: string,
  
  // Action creators
  toggleDisclosed: typeof Actions.toggleDisclosed,
  
  // Passthrough
  getQueryResolver?: (apiKey: string) => QueryResolver
}

const selectors: any = {
  treeState: Store.selectTreeState,
  columns: Store.selectColumns,
  apiKey: Store.selectAPIKey
}

const actionCreators: any = {
  toggleDisclosed: Actions.toggleDisclosed
}

export class ReportView extends React.Component<ReportProps, {data: TreeNode}> {
  static defaultProps = {
    getQueryResolver: Fusion.fusionAPIClient
  }
  
  displayStore: ReduxStore

  componentWillMount() {
    // Bind event handlers
    this.handleDisplayStateChange = this.handleDisplayStateChange.bind(this)
    
    // Display Store
    this.displayStore = createStore(DisplayStore.reducer, applyMiddleware(thunk, logger()))
    this.displayStore.subscribe(this.handleDisplayStateChange)
    this.updateDisplayStore(this.props)

    // Initial state    
    this.state = {data: null}
  }
  
  componentWillReceiveProps(newProps: ReportProps) {
    this.updateDisplayStore(newProps)
  }

  render() {
    if (this.state.data && this.state.data.values) {
      return (
        <TreeView data={this.state.data} onDisclosureChange={this.props.toggleDisclosed}>
          {this.props.columns.map((col, i) => <Column key={col.fieldID} {...col}/>)}
        </TreeView> 
      )
      
    } else {
      return (
        <TreeView
          onDisclosureChange={null}
          data={{
            values: null,
            getKey: () => null,
            renderPrimaryCell: () => null,
            children: {},
            queryString: ''
          }}
        />
      )
    }
  }
  
  updateDisplayStore({treeState, apiKey}: ReportProps) {
    this.displayStore.dispatch(
      DisplayStore.shapeChanged(treeState, this.props.getQueryResolver(apiKey)) 
    )
  }

  handleDisplayStateChange() {
    this.setState({
      data: DisplayStore.selectDisplayTree(this.displayStore.getState())
    })
  }
}

const route: any = connect(createStructuredSelector(selectors), actionCreators)(ReportView)
export default route
