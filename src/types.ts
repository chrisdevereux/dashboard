import * as React from 'react'


/** TreeView data node */
export interface TreeNode {
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


/** Represent an sql aggregate query **/
export interface Query {
  datasourceID: string,
  filter: Filter[],
  groupBy: string[],
  sum?: string[]
};

/** Representation of a sql query 'WHERE' condition */
export interface Filter {
  type: FilterType,
  lhs: string, 
  rhs: RowValue|RowValue[]
}

/** SQL filter operator */
export enum FilterType {
  equals,
  containsIgnoringCase,
  in
}



/** Row data type */
export interface RowData {
  groupBy: {[index: string]: RowValue},
  sum: {[index: string]: RowValue}
}

/** Row data variant */
export type RowValue = string|number|Date

/** Query Resolver **/
export type QueryResolver = (query: string) => Promise<RowData[]>



/** Display & data properties of the entire presentation **/
export interface ConfigDescriptor {
  apiKey: string,
  reports: ReportDescriptor[]
} 

/** Display & data properties of a report **/ 
export interface ReportDescriptor {
  /** Title of this report */
  title: string,
  
  /** ID of the associated fusion table datasource */
  datasourceID: string,
  
  /** Columns representing aggreagate data in this report */
  columns: ColumnDescriptor[],
  
  /** Columns representing grouped data in this report */
  groups: GroupDescriptor[],

  globalFilters: Filter[]
}

/** Display properties for a table data column */
export interface GroupDescriptor {
  /** User-displayed column title */
  title: string,
  
  /** Datasource field ID */
  fieldID: string,
  
  /** Return a unique ID (unique within the current node) for a child row */
  getKey: (data: RowData) => string,
  
  /** Given a data row, return the appropriate cell content for the column */
  renderCell: (data: RowData) => React.ReactNode
}

/** Display properties for a table data column */
export interface ColumnDescriptor {
  /** User-displayed column title */
  title: string,
  
  /** Datasource field ID */
  fieldID: string,
  
  /** Given a data row, return the appropriate cell content for the column */
  renderCell: (data: RowData) => React.ReactNode
}
