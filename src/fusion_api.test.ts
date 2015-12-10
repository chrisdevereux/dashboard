import {expect} from 'chai'
import * as Fusion from './fusion_api'

describe('fusion api', () => {
  describe('.decodeResponse()', () => {
    it('should decode the response', () => {
      expect(Fusion.decodeResponse({
        columns: ['a', 'b'],
        rows: [
          [1, 2],
          [3, 4]
        ]
      })).to.eql([
        {a: 1, b: 2},
        {a: 3, b: 4}
      ])
    })
  })
})
