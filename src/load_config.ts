import {RowValue, Filter, FilterType, ConfigDescriptor, ReportDescriptor, GroupDescriptor, ColumnDescriptor} from './types'

export type ConfigFile = {
  apiKey: string,
  reports: ReportSection[],
  datasources: {[index: string]: string}
}

type ReportSection = {
  title: string,
  datasource: string,
  groups: ColumnSection[],
  values: ColumnSection[],
  globalFilters?: GlobalFilterSection[]
}

type ColumnSection = {
  title: string,
  fieldID: string
}

type GlobalFilterSection = {
  type?: string,
  field: string,
  value: any
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
    assert(
      !section.globalFilters || Array.isArray(section.globalFilters),
      "Expected .globalFilters property to contain list of value column definitions",
      section
    )
    
    return {
      title: section.title,
      datasourceID: file.datasources[section.datasource],
      groups: section.groups.map(loadGroupColumn),
      columns: section.values.map(loadValueColumn),
      globalFilters: section.globalFilters ? section.globalFilters.map(loadGlobalFilter) : []
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
  
  function loadGlobalFilter(section: GlobalFilterSection): Filter {
    assert(
      typeof section.field === 'string',
      "Expected .field property to name a field in the datasource",
      section
    )
    
    const type = loadFilterType(section.type, section)
    
    return {
      type,
      lhs: section.field,
      rhs: loadFilterValue(section.value, type, section),
    }
  }
  
  function loadFilterType(type: string, context: Object): FilterType {
    if (!type) return FilterType.equals

    switch (type) {
      case 'equals': return FilterType.equals
      case 'contains': return FilterType.containsIgnoringCase
      case 'in': return FilterType.in
      default: throw Error(
        `Expected filter type to be one of: "equals", "contains" or "in"\nin: ${JSON.stringify(context, null, 2)}`
      )
    }
  }
  
  function loadFilterValue(value: any, type: FilterType, context: Object): RowValue {
    const getInnerValue = (x: any) => {
      assert(
        typeof x === 'string' || typeof x === 'number',
        "Expected filter value to be either a string or a number",
        context
      )
      
      return x
    }
    
    if (type === FilterType.in) {
      assert(
        Array.isArray(value),
        "Expected value provided for an 'in' filter to be a list of values",
        context
      )
      
      return value.map(getInnerValue)
      
    } else {
      return getInnerValue(value)
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
