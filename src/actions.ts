export type AnyAction = ToggleDisclosed

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
