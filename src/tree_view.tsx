import * as React from 'react'

/** TreeView data node **/
export type TreeNode = {
  /** Array of row data for this node's immediate children */
  values: RowData[]
  
  /** A data node for each disclosed child of this node view */
  children: {[index: string]: TreeNode}
  
  /** Function for rendering the primary (leftmost) column cell */
  renderPrimaryCell: (data: RowData) => React.ReactNode
}

/** Row data type */
export type RowData = {[index: string]: RowValue}

/** Row data variant */
export type RowValue = string|number|Date


/** TreeView component **/
export default class TreeView extends React.Component<TreeViewProps, {}> {
  render() {
    const {data, children} = this.props
    
    return (
      <table>
        <thead>
          <tr>
            <th/>
            {children}
          </tr>
        </thead>
        <tbody>
        {
          data.values.map((row: RowData, i: number) =>
            <Row key={String(i)} 
              data={row}
              columns={children}
              renderPrimaryCell={data.renderPrimaryCell}
            />
          )
        }
        </tbody>
      </table>
    );
  }
}

export type TreeViewProps = {
  /** Columns are defined as children of the table */
  children?: React.ReactElement<ColumnProps>,
  
  /** Root data node */
  data: TreeNode
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
  render() {
    return (
      <tr>
        <td>{this.props.renderPrimaryCell(this.props.data)}</td>
        {
          React.Children.map(this.props.columns, (col: React.ReactElement<ColumnProps>) =>
            <td>{col.props.renderCell(this.props.data)}</td>
          )
        }
      </tr>
    )
  }
}

type RowProps = {
  key?: string,
  
  /** Column elements passed from TreeView */
  columns: React.ReactElement<ColumnProps>, 
  
  /** Row data */
  data: RowData,
  
  /** Primary cell renderer */
  renderPrimaryCell: (data: RowData) => React.ReactNode 
}
