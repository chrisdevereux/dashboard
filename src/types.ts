import * as React from 'react'

/** TreeView data node */
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

/** Row data type */
export type RowData = {[index: string]: RowValue}

/** Row data variant */
export type RowValue = string|number|Date


/** Display properties for a table data column */
export type ColumnDescriptor = {
  /** User-displayed column title */
  title: string,
  
  /** Given a data row, return the appropriate cell content for the column */
  renderCell: (data: RowData) => React.ReactNode
}
