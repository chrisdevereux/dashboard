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
  
  queryString: string
}



/** Row data type */
export type RowData = {[index: string]: RowValue}

/** Row data variant */
export type RowValue = string|number|Date

/** Query Resolver **/
export type QueryResolver = (query: string) => Promise<RowData[]>



/** Display & data properties of the entire presentation **/
export type ConfigDescriptor = {
  reports: ReportDescriptor[]
} 

/** Display & data properties of a report **/ 
export type ReportDescriptor = {
  /** Title of this report */
  title: string,
  
  /** ID of the associated fusion table datasource */
  datasourceID: string,
  
  /** Columns representing aggreagate data in this report */
  columns: ColumnDescriptor[],
  
  /** Columns representing grouped data in this report */
  groups: GroupDescriptor[]
}

/** Display properties for a table data column */
export type GroupDescriptor = {
  /** User-displayed column title */
  title: string,
  
  /** Given a data row, return the appropriate cell content for the column */
  renderCell: (data: RowData) => React.ReactNode
}

/** Display properties for a table data column */
export type ColumnDescriptor = {
  /** User-displayed column title */
  title: string,
  
  /** Given a data row, return the appropriate cell content for the column */
  renderCell: (data: RowData) => React.ReactNode
}
