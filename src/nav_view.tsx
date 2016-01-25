import * as React from 'react'

interface NavViewProps {
  children?: React.ReactNode
  onSelected: (key: string|number) => void
  options: NavOption[]
  value: string|number
}

export interface NavOption {
  id: string|number,
  title: string
}

export default class NavView extends React.Component<NavViewProps, {}> {
  render() {
    return (
      <div className='nav-view'>
        <ul>
        {
          this.props.options.map((option: NavOption) => 
            <NavItem key={option.id} {...option} 
              active={this.props.value === option.id}
              onClick={this.props.onSelected}
            />
          )
        }
        </ul>
        <div>
        {
          this.props.children
        }
        </div>
      </div>
    )
  }  
}

interface NavItemProps extends NavOption {
  key?: number|string
  active: boolean
  onClick: (key: number|string) => void
}

export class NavItem extends React.Component<NavItemProps, {}> {
  componentWillMount() {
    this.handleClick = this.handleClick.bind(this)
  }
  
  handleClick(evt: React.SyntheticEvent) {
    this.props.onClick(this.props.id)
    evt.preventDefault()
  }
  
  render() {
    return (
      <li className={this.props.active ? 'active' : 'inactive'}>
        <a href='#' onClick={this.handleClick}>
          {this.props.title}
        </a>
        <div className='active-indicator-container'>
          <div className='active-indicator'/>
        </div>
      </li>
    )
  }
}
