import * as React from 'react'
import {expect} from 'chai'
import {createRenderer} from 'react-addons-test-utils'

import TreeView, {Column, Row, DisclosureState} from './tree_view'
import {TreeNode, RowData} from './types'

describe("TreeView", () => {
  it('should render', () => {
    const getData = (data: RowData) => String(data.groupBy['title'])
    
    const data: TreeNode = {
      // Root: Branch node with data loaded.
      values: [
        {groupBy: {title: 'A'}, sum: {val: 1}},
        {groupBy: {title: 'B'}, sum: {val: 2}},
        {groupBy: {title: 'C'}, sum: {val: 3}}
      ],
      queryString: '',
      renderPrimaryCell: getData,
      getKey: getData,
      children: {
        A: {
          // Child A: Expanded leaf node with data loaded
          values: [
            {groupBy: {title: 'A1'}, sum: {val: 1}},
            {groupBy: {title: 'A2'}, sum: {val: 2}}
          ],
          renderPrimaryCell: getData,
          queryString: '',
          getKey: getData,
          children: null
        },
        B: {
          // Child B: Expanded leaf node with data not loaded
          values: null,
          renderPrimaryCell: getData,
          queryString: '',
          getKey: getData,
          children: null
        }
      }
    }
    const tree = (
      <TreeView data={data} onDisclosureChange={() => {}}>
        <Column fieldID='A' title='Title' renderCell={getData}/>,
        <Column fieldID='B' title='Value' renderCell={getData}/>
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
          <Row disclosureState={DisclosureState.Disclosed} keypath={['A']} onClick={() => {}} columns={tree.props.children} data={data.values[0]} renderPrimaryCell={getData}/>
          <Row disclosureState={DisclosureState.Leaf} keypath={['A', 'A1']} onClick={() => {}} columns={tree.props.children} data={data.children['A'].values[0]} renderPrimaryCell={getData}/>
          <Row disclosureState={DisclosureState.Leaf} keypath={['A', 'A2']} onClick={() => {}} columns={tree.props.children} data={data.children['A'].values[1]} renderPrimaryCell={getData}/>
          <Row disclosureState={DisclosureState.Loading} keypath={['B']} onClick={() => {}} columns={tree.props.children} data={data.values[1]} renderPrimaryCell={getData}/>
          <Row disclosureState={DisclosureState.Undisclosed} keypath={['C']} onClick={() => {}} columns={tree.props.children} data={data.values[2]} renderPrimaryCell={getData}/>
        </tbody>
      </table>
    )
  })
})
