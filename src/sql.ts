import {Query, Filter, FilterType, RowValue} from './types'

export function encode(query: Query): string {
  return [
    encodeSelectClause(query),
    `FROM ${query.datasourceID}`,
    encodeWhereClause(query),
    encodeGroupByClause(query)
  ].filter(x => x !== null).join(' ')
}

export function encodeSelectClause(q: Query): string {
  const {groupBy, sum} = q;

  const select = [
    ...groupBy.map(x => encodeColumn(x)),
    ...(sum || []).map(x => encodeColumn(x, 'SUM'))
  ];

  if (select.length === 0) {
    throw Error(`Query must contain at least one column ${q}`);

  } else {
    return `SELECT ${select.join(', ')}`
  }
}

export function encodeWhereClause({filter}: Query): string {
  const where = filter.map((f: Filter) => {
    switch (f.type) {
    case FilterType.equals:
      return `${enquote(f.lhs)} = ${encodeValue(f.rhs)}`
    case FilterType.containsIgnoringCase:
      return `${enquote(f.lhs)} CONTAINS IGNORING CASE ${encodeValue(f.rhs)}`
    case FilterType.in:
      return `${enquote(f.lhs)} IN ${encodeValue(f.rhs)}`
    }
  });

  if (where.length > 0) {
    return `WHERE ${where.join(' AND ')}`;

  } else {
    return null;
  }
}

export function encodeGroupByClause({groupBy}: Query): string {
  if (groupBy.length === 0) {
    return null;

  } else {
    return `GROUP BY ${groupBy.map(x => encodeColumn(x))}`;
  }
}

export function encodeColumn(name: string, qualifier?: string): string {
  if (qualifier) {
    return `${qualifier}(${enquote(name)})`

  } else {
    return enquote(name);
  }
}

export function encodeValue(value: RowValue | RowValue[]): string {
  if (Array.isArray(value)) {
    return `(${value.map(encodeValue).join(',')})`
    
  } else if (value instanceof Date) {
    const fixupDigit = (x: number) => 
      String(x).length === 1 ? '0' + String(x) : String(x)

    return enquote([
      value.getFullYear(),
      fixupDigit(value.getMonth() + 1),
      fixupDigit(value.getDate())
    ].join('.'));

  } else if (typeof value === 'number') {
    return String(value);

  } else if (typeof value === 'string') {
    return enquote(value);

  } else {
    throw new Error(`Invalid value ${typeof value} ${value}`);
  }
}

export function enquote(str: string): string {
  return `'${str.replace(/'/g, `\\'`)}'`;
}
