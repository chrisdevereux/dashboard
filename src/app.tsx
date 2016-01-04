import * as React from 'react'
import {render} from 'react-dom'

import TreeView, {Column} from './tree_view'
import {TreeNode, RowData} from './types'

class App extends React.Component<{}, {data: TreeNode}> {
  componentWillMount() {
    this.toggleDisplayed = this.toggleDisplayed.bind(this)
    this.state = {data: this.generateNode()}
  }

  render() {
    return (
      <TreeView data={this.state.data} onDisclosureChange={this.toggleDisplayed}>
        <Column fieldID='foo' title='Title' renderCell={(data: RowData) => String(data['title'])}/>
        <Column fieldID='foo' title='Value' renderCell={(data: RowData) => String(data['value'])}/>
      </TreeView> 
    )
  }
  
  toggleDisplayed(keypath: string[]) {
    this.setState({
      data: this.toggle(keypath, this.state.data)
    });
  }
  
  toggle(keypath: string[], node: TreeNode): TreeNode {
      const [key, ...rest] = keypath
      
      if (key) {
        return Object.assign(node, {
          children: Object.assign(node.children, {
            [key]: this.toggle(rest, node.children[key])
          })
        }) 
        
      } else {
        if (node) {
          return null

        } else {
          return this.generateNode()
        }
      }
    }
  
  generateNode(): TreeNode {
    return {
      values: this.generateValues(),
      renderPrimaryCell: data => `Row ${data['title']}`,
      getKey: data => String(data['title']),
      children: Math.random() < 0.2 ? null : {},
      queryString: ''
    }
  }
  
  generateValues(): RowData[]  {
    const data: RowData[] = []
    const start = Math.floor(Math.random() * 100)
    
    for (let i = 0; i < 20; i++) {
      data[i] = {
        title: start + i,
        value: Math.random() * 10000
      }
    }
    
    return data
  }
}

render(<App/>, document.getElementById("app"))
