import * as React from 'react'
import {render} from 'react-dom'
import{createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import logger = require('redux-logger')

import * as Store from './store'
import * as Actions from './actions'
import Report from './report'

import http from './http'
import loadConfig from './load_config'

const store = createStore(Store.reduceApp, applyMiddleware(logger()))

enum LoadState {
  loaded,
  loading,
  error,
  mising
}

interface State {
  loadState?: LoadState
  reportIndex?: number
}

class App extends React.Component<{}, State> {
  componentWillMount() {
    this.handleReportSelected = this.handleReportSelected.bind(this)
    
    this.state = {
      loadState: LoadState.loading,
      reportIndex: 0
    }
    
    this.loadConfig()
  }
  
  handleReportSelected(reportIndex: number) {
    this.setState({reportIndex})
  }
  
  handleConfigRecieved(req: XMLHttpRequest) {
    const json = JSON.parse(req.responseText)
    const config = loadConfig(json)
    
    store.dispatch(Actions.setConfig(config))
    this.setState({loadState: LoadState.loaded})
  }
  
  handleConfigLoadFailed(error: Error) {
    this.setState({loadState: LoadState.error})
  }
  
  loadConfig() {
    const url = decodeURIComponent(location.search.substr(1))
    
    if (url.length > 0) {
      http('get', url)
        .then(this.handleConfigRecieved.bind(this))
        .catch(this.handleConfigLoadFailed.bind(this))
      
    } else {
      this.setState({loadState: LoadState.mising})
    }
  }
  
  render() {
    return (
      <Provider store={store}>
        <Report reportIndex={this.state.reportIndex}/>
      </Provider>
    )
  }
}

render(<App/>, document.getElementById("app"))
