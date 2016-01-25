import * as React from 'react'
import{createStore, applyMiddleware, Store as ReduxStore} from 'redux'
import thunk = require('redux-thunk')
import {connect, Provider} from 'react-redux'
import logger = require('redux-logger')
import {createStructuredSelector} from 'reselect'

import * as Store from './store'
import * as Actions from './actions'
import * as DisplayStore from './display_store'
import * as Fusion from './fusion_api'
import TreeView, {Column} from './tree_view'
import {TreeNode, RowData} from './types'

type ReportProps = {
  treeState: TreeNode,
  toggleDisclosed: typeof Actions.toggleDisclosed
  apiKey: string
}

const selectors: any = {
  treeState: Store.selectTreeState,
  apiKey: Store.selectAPIKey
}

const actionCreators: any = {
  toggleDisclosed: Actions.toggleDisclosed
}

class Report extends React.Component<ReportProps, {data: TreeNode}> {
  displayStore: ReduxStore

  componentWillMount() {
    // Bind event handlers
    this.handleDisplayStoreChange = this.handleDisplayStoreChange.bind(this)
    
    // Display Store
    this.displayStore = createStore(DisplayStore.reducer, applyMiddleware(thunk, logger()))
    this.displayStore.subscribe(this.handleDisplayStoreChange)
    this.updateDisplayStore(this.props)

    // Initial state    
    this.state = {data: null}
  }
  
  componentWillReceiveProps(newProps: ReportProps) {
    this.updateDisplayStore(newProps)
  }

  render() {
    if (this.state.data) {
      return (
        <TreeView data={this.state.data} onDisclosureChange={this.props.toggleDisclosed}>
          <Column fieldID='foo' title='Title' renderCell={(data: RowData) => 'todo'}/>
          <Column fieldID='foo' title='Value' renderCell={(data: RowData) => 'todo'}/>
        </TreeView> 
      )

    } else {
      return <span>Loading</span>
    }
  }
  
  updateDisplayStore({treeState, apiKey}: ReportProps) {
    this.displayStore.dispatch(
      DisplayStore.shapeChanged(treeState, Fusion.fusionAPIClient(apiKey)) 
    )
  }

  handleDisplayStoreChange() {
    this.setState({
      data: DisplayStore.selectDisplayTree(this.displayStore.getState())
    })
  }
}

const route: any = connect(createStructuredSelector(selectors), actionCreators)(Report)
export default route
