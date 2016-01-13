import {expect} from 'chai'
import loadConfig from './load_config'

describe('loadConfig', () => {
  it('should load config', () => {
    loadConfig({
      apiKey: 'blub',
      datasources: {
        a: 'ds-a'
      },
      reports: [
        {
          title: 'myReport',
          datasource: 'a',
          groups: [
            {
              title: 'g1',
              fieldID: 'a'
            } 
          ],
          values: [
            {
              title: 'v1',
              fieldID: 'a'
            }
          ]
        }
      ]
    })
  })  
})
