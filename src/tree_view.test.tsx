import * as React from 'react'
import {expect} from 'chai'
import {createRenderer} from 'react-addons-test-utils'

import TreeView, {Column, Row, DisclosureState} from './tree_view'
import {TreeNode} from './types'

describe("TreeView", () => {
  it('should render', () => {
    const data: TreeNode = {
      values: [
        {title: 'A', val: 1}, 
        {title: 'B', val: 2}
      ],
      queryString: '',
      renderPrimaryCell: data => data['title'],
      getKey: data => String(data['title']),
      children: {
        A: {
          values: [
            {title: 'A1', val: 1},
            {title: 'A2', val: 2}    
          ],
          renderPrimaryCell: data => data['title'],
          queryString: '',
          getKey: data => String(data['title']),
          children: null
        }
      }
    }
    const tree = (
      <TreeView data={data} onDisclosureChange={() => {}}>
        <Column title='Title' renderCell={data => String(data['title'])}/>,
        <Column title='Value' renderCell={data => String(data['val'])}/>
      </TreeView> 
    )
    
    const renderer = createRenderer()
    renderer.render(tree)
    
    expect(renderer.getRenderOutput()).to.equalJSX(
      <table className='pivot'>
        <thead>
          <tr>
            <th/>
            {tree.props.children}
          </tr>
        </thead>
        <tbody>
          <Row disclosureState={DisclosureState.Disclosed} keypath={['A']} onClick={() => {}} columns={tree.props.children} data={data.values[0]} renderPrimaryCell={data.renderPrimaryCell}/>
          <Row disclosureState={DisclosureState.Leaf} keypath={['A', 'A1']} onClick={() => {}} columns={tree.props.children} data={data.children['A'].values[0]} renderPrimaryCell={data.renderPrimaryCell}/>
          <Row disclosureState={DisclosureState.Leaf} keypath={['A', 'A2']} onClick={() => {}} columns={tree.props.children} data={data.children['A'].values[1]} renderPrimaryCell={data.renderPrimaryCell}/>
          <Row disclosureState={DisclosureState.Undisclosed} keypath={['B']} onClick={() => {}} columns={tree.props.children} data={data.values[1]} renderPrimaryCell={data.renderPrimaryCell}/>
        </tbody>
      </table>
    )
  })
})
