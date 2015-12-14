import {expect} from 'chai'
import * as Util from './util'

describe('mapDictionary()', () => {
  it('should return mapped values', () => {
    expect(Util.mapDictionary({a: 1, b: 2}, x => x * 2)).to.eql({
      a: 2, b: 4
    })
  })
})