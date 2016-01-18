import {ConfigDescriptor, ReportDescriptor, GroupDescriptor, ColumnDescriptor} from './types'

export type ConfigFile = {
  apiKey: string,
  reports: ReportSection[],
  datasources: {[index: string]: string}
}

type ReportSection = {
  title: string,
  datasource: string,
  groups: ColumnSection[],
  values: ColumnSection[]
}

type ColumnSection = {
  title: string,
  fieldID: string
}

export default function loadConfig(file: ConfigFile): ConfigDescriptor {
  assert(
    typeof file.apiKey === 'string',
    "Expected .apiKey property to contain a Google API key authorising access to the Fusion Tables API (as defined in the Google developer console)",
    file
  )
  assert(
    Array.isArray(file.reports),
    "Expected .reports property to contain list of reports",
    file
  )
  assert(
    typeof file.reports === 'object' && file.reports !== null,
    "Expected .datasources property to contain datasource mapping",
    file
  )
  
  return {
    apiKey: file.apiKey,
    reports: file.reports.map(loadReports) 
  }
  
  function loadReports(section: ReportSection): ReportDescriptor {
    assert(
      typeof section.title === 'string',
      "Expected .title property to contain the report's title",
      section
    )
    assert(
      section.datasource in file.datasources,
      "Expected .datasource property to reference a datasource defined in the document's datasources section",
      section
    )
    assert(
      Array.isArray(section.groups),
      "Expected .groups property to contain list of group column definitions",
      section
    )
    assert(
      Array.isArray(section.values),
      "Expected .values property to contain list of value column definitions",
      section
    )
    
    return {
      title: section.title,
      datasourceID: file.datasources[section.datasource],
      groups: section.groups.map(loadGroupColumn),
      columns: section.values.map(loadValueColumn)
    }
  }
  
  function loadGroupColumn(section: ColumnSection): GroupDescriptor {
    validateColumnSection(section)
    
    return {
      title: section.title,
      fieldID: section.fieldID,
      getKey: (row) => JSON.stringify(row.groupBy[section.fieldID]),
      renderCell: (row) => String(row.groupBy[section.fieldID])
    }
  }
  
  function loadValueColumn(section: ColumnSection): ColumnDescriptor {
    validateColumnSection(section)
    
    return {
      title: section.title,
      fieldID: section.fieldID,
      renderCell: (row) => String(row.sum[section.fieldID])
    }
  }
}

function validateColumnSection(section: ColumnSection) {
  assert(
    typeof section.title === 'string',
    "Expected .title property to contain the column's title",
    section
  )
  assert(
    typeof section.fieldID === 'string',
    "Expected .fieldID property to identify the represented datasource column",
    section
  )
}

function assert(condition: boolean, message: string, context: Object) {
  if (!condition) {
    throw Error(
      `Error loading config:\n  ${message}\nin: ${JSON.stringify(context, null, 2)}`
    )
  }
}
