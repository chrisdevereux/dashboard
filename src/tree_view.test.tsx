import * as React from 'react'
import {expect} from 'chai'
import {createRenderer} from 'react-addons-test-utils'

import TreeView, {Column, Row, TreeNode, ColumnProps} from './tree_view'

describe("TreeView", () => {
  it('should render', () => {
    const data: TreeNode = {
      values: [{title: 'A', val: 1}, {title: 'B', val: 2}], children: {},
      renderPrimaryCell: data => data['title']
    }
    const tree = (
      <TreeView data={data}>
        <Column title='Title' renderCell={data => String(data['title'])}/>,
        <Column title='Value' renderCell={data => String(data['val'])}/>
      </TreeView> 
    )
    
    const renderer = createRenderer()
    renderer.render(tree)
    
    expect(renderer.getRenderOutput()).to.equalJSX(
      <table>
        <thead>
          <tr>
            <th/>
            {tree.props.children}
          </tr>
        </thead>
        <tbody>
          <Row columns={tree.props.children} data={data.values[0]} renderPrimaryCell={data.renderPrimaryCell}/>
          <Row columns={tree.props.children} data={data.values[1]} renderPrimaryCell={data.renderPrimaryCell}/>
        </tbody>
      </table>
    )
  })
})
