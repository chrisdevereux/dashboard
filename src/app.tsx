import * as React from 'react'
import {render} from 'react-dom';

import TreeView, {Column, TreeNode} from './tree_view'

class App extends React.Component<{}, {}> {
  render() {
    const data: TreeNode = {
      renderPrimaryCell: data => data['title'],
      values: [{title: 'A', val: 1}, {title: 'B', val: 2}],
      children: {}
    }

    return (
      <TreeView data={data}>
        <Column title='Title' renderCell={data => String(data['title'])}/>
        <Column title='Value' renderCell={data => String(data['val'])}/>
      </TreeView> 
    )
  }
}

render(<App/>, document.getElementById("app"))
