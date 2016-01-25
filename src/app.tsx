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

class App extends React.Component<{}, {loadState: LoadState}> {
  componentWillMount() {
    const url = decodeURIComponent(location.search.substr(1))
    
    if (url.length > 0) {
      this.setState({loadState: LoadState.loading})

      http('get', url)
        .then(this.loadConfig.bind(this))
        .catch(this.handleConfigLoadFailed.bind(this))
      
    } else {
      this.setState({loadState: LoadState.mising})
    }
  }
  
  loadConfig(req: XMLHttpRequest) {
    const json = JSON.parse(req.responseText)
    const config = loadConfig(json)
    
    store.dispatch(Actions.setConfig(config))
    this.setState({loadState: LoadState.loaded})
  }
  
  handleConfigLoadFailed(error: Error) {
    this.setState({loadState: LoadState.error})
  }
  
  render() {
    return (
      <Provider store={store}>
        <Report reportIndex={0}/>
      </Provider>
    )
  }
}

render(<App/>, document.getElementById("app"))
