import {ConfigDescriptor} from './types'

export type AnyAction = ToggleDisclosed|SetConfig|SetReport

/** ToggleDisclosed Action **/
type ToggleDisclosed = {type: string, keypath: string[]}

/** Action creator **/
export function toggleDisclosed(keypath: string[]): ToggleDisclosed {
  return Object.freeze({type: 'toggle-disclosed', keypath})
}

/** Test for ToggleDisclosed action */
export function isToggleDisclosed(a: AnyAction): a is ToggleDisclosed {
  return a.type && a.type === 'toggle-disclosed'
}



/** 
 * SetReport Action
 */

type SetReport = {
  type: string,
  index: number
}

export function setReport(index: number): SetReport {
  return {type: 'set-report', index}
}

export function isSetReport(action: AnyAction): action is SetReport {
  return action.type === 'set-report'
}



/** SetConfig Action **/
type SetConfig = {
  type: string,
  config: ConfigDescriptor
}

/** Action creator **/
export function setConfig(config: ConfigDescriptor): SetConfig {
  return Object.freeze({type: 'set-config', config})
}

/** Test for ToggleDisclosed action */
export function isSetConfig(a: AnyAction): a is SetConfig {
  return a.type && a.type === 'set-config'
}
