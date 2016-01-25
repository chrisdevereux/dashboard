import * as React from 'react'
import {expect} from 'chai'
import {createRenderer} from 'react-addons-test-utils'

import NavView, {NavItem} from './nav_view'

describe('nav view', () => {
  it('should render', () => {
    const options = [{id: 'a', title: 'A'}, {id: 'b', title: 'B'}]
    const tree = (
      <NavView options={options} value={'a'} onSelected={null}>
        Hello
      </NavView> 
    )
    
    const renderer = createRenderer()
    renderer.render(tree)
    
    expect(renderer.getRenderOutput()).to.equalJSX(
      <div className='nav-view'>
        <ul>
          <NavItem id='a' title='A' onClick={null} active={true}/>
          <NavItem id='b' title='B' onClick={null} active={false}/>
        </ul>
        <div>
          Hello
        </div>
      </div>
    )
  })  
})
