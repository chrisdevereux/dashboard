import {expect} from 'chai'

import {FilterType} from './types'
import * as SQL from './sql'

describe('encodeSQL', () => {
  it('should encode query', () => {
    expect(SQL.encode({
      datasourceID: 'source',
      filter: [],
      groupBy: ['a']
    })).to.eql(`SELECT 'a' FROM source GROUP BY 'a'`)
  })  
  
  it('should encode filters', () => {
    expect(SQL.encode({
      datasourceID: 'source',
      filter: [
        {type: FilterType.equals, lhs: 'a', rhs: 'foo'},
        {type: FilterType.in, lhs: 'a', rhs: 'foo'},
        {type: FilterType.containsIgnoringCase, lhs: 'a', rhs: 'foo'},
        {type: FilterType.notEqual, lhs: 'a', rhs: 'foo'}
      ],
      groupBy: ['a']
    })).to.eql(`SELECT 'a' FROM source WHERE 'a' = 'foo' AND 'a' IN 'foo' AND 'a' CONTAINS IGNORING CASE 'foo' AND 'a' NOT EQUAL TO 'foo' GROUP BY 'a'`)
  })  
  
  it('should encode sum clause', () => {
    expect(SQL.encode({
      datasourceID: 'source',
      sum: ['b'],
      filter: [],
      groupBy: ['a']
    })).to.eql(`SELECT 'a', SUM('b') FROM source GROUP BY 'a'`)
  })
  
  it('should encode string value', () => {
    expect(SQL.encode({
      datasourceID: 'source',
      filter: [
        {type: FilterType.equals, lhs: 'a', rhs: 'foo'},
        {type: FilterType.in, lhs: 'a', rhs: 'foo'},
        {type: FilterType.containsIgnoringCase, lhs: 'a', rhs: 'foo'}
      ],
      groupBy: ['a']
    })).to.eql(`SELECT 'a' FROM source WHERE 'a' = 'foo' AND 'a' IN 'foo' AND 'a' CONTAINS IGNORING CASE 'foo' GROUP BY 'a'`)
  })
  
  it('should encode string', () => {
    expect(SQL.encodeValue('foo')).to.eql(`'foo'`)
  }) 
  
  it('should encode number', () => {
    expect(SQL.encodeValue(123)).to.eql(`123`)
  }) 
  
  it('should encode date', () => {
    expect(SQL.encodeValue(new Date('2011.01.01'))).to.eql(`'2011.01.01'`)
  })
  
  it('should escape apostrophes in enquoted strings', () => {
    expect(SQL.enquote(`Who's that's`)).to.eql(`'Who\\'s that\\'s'`)
  })
})
