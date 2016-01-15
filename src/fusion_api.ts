import {QueryResolver, RowData, RowValue} from './types'
import http from './http'

export function fusionAPIClient(apiKey: string): QueryResolver {
  return queryString => {
    const url = [
      `https://www.googleapis.com/fusiontables/v2/query?key=${apiKey}`,
      `sql=${encodeURIComponent(queryString)}`
    ].join('&')
    
    return http('get', url).then(req => decodeResponse(JSON.parse(req.responseText)))
  }
}

export function decodeResponse(response: any): RowData[] {
  const columns: string[] = response.columns || []
  const rows: RowValue[][] = response.rows || []
  
  return rows.map(rowIn => {
    const rowOut: RowData = {}
    
    columns.forEach((key, i) => {
      rowOut[key] = rowIn[i]
    })
    
    return rowOut
  })
}
