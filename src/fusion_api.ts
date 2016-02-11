import {QueryResolver, RowData, RowValue} from './types'
import http from './http'

declare namespace process {
  namespace env {
    var GOOGLE_APIS_HOST: string
  }
}

export function fusionAPIClient(apiKey: string): QueryResolver {
  return queryString => {
    // Debug override
    const host = process.env.GOOGLE_APIS_HOST || 'https://www.googleapis.com'
    
    const url = [
      `${host}/fusiontables/v2/query?key=${apiKey}`,
      `sql=${encodeURIComponent(queryString)}`
    ].join('&')
    
    return http('get', url).then(req => decodeResponse(JSON.parse(req.responseText)))
  }
}

export function decodeResponse(response: any): RowData[] {
  const columns: string[] = response.columns || []
  const rows: RowValue[][] = response.rows || []
  
  return rows.map(rowIn => {
    const rowOut: RowData = {
      groupBy: {},
      sum: {}
    }
    
    columns.forEach((key, i) => {
      const sumMatch = key.match(/SUM\((.*)\)/)
      
      if (sumMatch) {
        const [, key] = sumMatch
        rowOut.sum[key] = rowIn[i]
        return
      }
        
      rowOut.groupBy[key] = rowIn[i]
    })
    
    return rowOut
  })
}
