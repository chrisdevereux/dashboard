import * as React from 'react'
import {expect} from 'chai'
import {createRenderer} from 'react-addons-test-utils'

import {ReportView} from './report'
import {TreeNode, RowData} from './types'

describe("ReportView", () => {
  const rowGetter = (row: RowData) => 'foo'
  const stubResolver = (key: string) => (query: string) => Promise.resolve([])
    
  it('should render with null columns', () => {
    const tree = (
      <ReportView
        apiKey='xyz'
        columns={null}
        toggleDisclosed={null}
        getQueryResolver={stubResolver}
        treeState={{
          children: {},
          getKey: rowGetter,
          queryString: '',
          values: [],
          renderPrimaryCell: rowGetter
        }}
      /> 
    )
    
    const renderer = createRenderer()
    renderer.render(tree)
  }) 

  it('should render with columns', () => {
    const tree = (
      <ReportView
        apiKey='xyz'
        columns={[]}
        toggleDisclosed={null}
        getQueryResolver={stubResolver}
        treeState={{
          children: {},
          getKey: rowGetter,
          queryString: '',
          values: [],
          renderPrimaryCell: rowGetter
        }}
      /> 
    )
    
    const renderer = createRenderer()
    renderer.render(tree)
  })
})
