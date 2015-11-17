import * as React from 'react'

/** TreeView data node **/
export type TreeNode = {
  /** Array of row data for this node's immediate children */
  values: RowData[]
  
  /** A data node for each disclosed child of this node view */
  children: {[index: string]: TreeNode}
  
  /** Function for rendering the primary (leftmost) column cell */
  renderPrimaryCell: (data: RowData) => React.ReactNode
  
  /** Return a unique ID (unique within the current node) for a child row */
  getKey: (data: RowData) => string
}

type DisclosureChangeCallback = (keypath: string[]) => void

/** Row data type */
export type RowData = {[index: string]: RowValue}

/** Row data variant */
export type RowValue = string|number|Date


/** TreeView component **/
export default class TreeView extends React.Component<TreeViewProps, {}> {
  render() {
    const {data, children} = this.props
    
    return (
      <table className='pivot'>
        <thead>
          <tr>
            <th/>
            {children}
          </tr>
        </thead>
        <tbody>
          {this.renderChildren(data, [])}
        </tbody>
      </table>
    );
  }
  
  renderNode(row: RowData, node: TreeNode, parentKeypath: string[]): React.ReactNode[] {
    const key = node.getKey(row)
    const keypath = [...parentKeypath, key]
    const {children, renderPrimaryCell} = node
    
    return [
      <Row key={keypath.join('>')} 
        keypath={keypath}
        data={row}
        columns={this.props.children}
        renderPrimaryCell={renderPrimaryCell}
        onClick={this.props.onDisclosureChange}
        disclosureState={this.disclosureStateFor(key, node)}
      />,
      ...(
        children && children[key] && this.renderChildren(children[key], keypath)
      )
    ]
  }
  
  renderChildren(node: TreeNode, keypath: string[]): React.ReactNode[] {
    const nodes = node.values.map((row: RowData) =>
      this.renderNode(row, node, keypath)
    )
    
    return nodes.concat.apply([], nodes)
  }
  
  disclosureStateFor(key: string, node: TreeNode): DisclosureState {
    if (node.children === null) {
      return DisclosureState.Leaf
      
    } else if (node.children[key]) {
      return DisclosureState.Disclosed
      
    } else {
      return DisclosureState.Undisclosed
    }
  }
}

export type TreeViewProps = {
  /** Columns are defined as children of the table */
  children?: React.ReactElement<ColumnProps>
  
  /** Root data node */
  data: TreeNode
  
  /** Notify that a node requests a change to its disclosed state */
  onDisclosureChange: DisclosureChangeCallback
}



/** 
 * Column in a TreeView.
 * 
 * Responsible for rendering both the column heading (when mounted as a component),
 * and, via its renderCell prop, a data cell in the table body.
 * */
export class Column extends React.Component<ColumnProps, {}> {
  render() {
    return <th>{this.props.title}</th>
  }  
}

export type ColumnProps = {
  /** User-displayed column title */
  title: string,
  
  /** Given a data row, return the appropriate cell content for the column */
  renderCell: (data: RowData) => React.ReactNode
}


/** Row in a TreeView **/
export class Row extends React.Component<RowProps, {}> {
  componentWillMount() {
    this.handleClicked = this.handleClicked.bind(this)
  }
  
  render() {
    return (
      <tr>
        <td className='primary-column' style={{paddingLeft: `${this.indentationFactor()}em`}}>
          {this.disclosureIndicator()}
          {this.renderPrimaryColumnContent()}
        </td>
        {
          React.Children.map(this.props.columns, (col: React.ReactElement<ColumnProps>) =>
            <td>{col.props.renderCell(this.props.data)}</td>
          )
        }
      </tr>
    )
  }
  
  renderPrimaryColumnContent(): React.ReactNode {
    if (this.props.disclosureState !== DisclosureState.Leaf) {
      return (
        <a href='#' onClick={this.handleClicked}>
          {this.props.renderPrimaryCell(this.props.data)}
        </a>
      )

    } else {
      return this.props.renderPrimaryCell(this.props.data)
    }
  }
  
  indentationFactor(): number {
    if (this.props.disclosureState === DisclosureState.Leaf) {
      return this.props.keypath.length
    } else {
      return this.props.keypath.length - 1
    }
  }
  
  disclosureIndicator(): React.ReactNode {
    switch (this.props.disclosureState) {
    case DisclosureState.Disclosed: return <span className='disclosed-indicator' style={{width: '1em'}}/>
    case DisclosureState.Undisclosed: return <span className='undisclosed-indicator' style={{width: '1em'}}/>
    case DisclosureState.Leaf: return null
    }
  }
  
  handleClicked(evt: React.SyntheticEvent) {
    this.props.onClick(this.props.keypath)
    evt.preventDefault()
  }
}

type RowProps = {
  key?: string,
  
  /** Path identifying row's location in tree */
  keypath: string[],
  
  /** Column elements passed from TreeView */
  columns: React.ReactElement<ColumnProps>, 
  
  /** Row data */
  data: RowData,
  
  /** Primary cell renderer */
  renderPrimaryCell: (data: RowData) => React.ReactNode 
  
  /** Disclosure change event */
  onClick: DisclosureChangeCallback,

  /** The current state of the row */  
  disclosureState: DisclosureState 
}

export enum DisclosureState {
  Disclosed,
  Undisclosed,
  Leaf
}
