import {expect} from 'chai'
import * as Fusion from './fusion_api'

describe('fusion api', () => {
  describe('.decodeResponse()', () => {
    it('should decode the response', () => {
      expect(Fusion.decodeResponse({
        columns: ['a', 'SUM(b)'],
        rows: [
          [1, 2],
          [3, 4]
        ]
      })).to.eql([
        {groupBy: {a: 1}, sum: {b: 2}},
        {groupBy: {a: 3}, sum: {b: 4}}
      ])
    })
  })
})
