import { cloneobj } from 'tn-cloneobj'
import { isArray, isObject, isString } from 'tn-validate'
import { DiffObj, diffobj } from './accessories/diffobj'
import { DiffStr, diffstr } from './accessories/diffstr'
export enum DiffKind {
  IDENTICAL,
  STRING,
  OBJECT,
  STATIC,
}
export type Diff =
  | [Kind: DiffKind.IDENTICAL]
  | [Kind: DiffKind.STATIC, Prev: any, Value: any]
  | [Kind: DiffKind.STRING, DiffStr]
  | [Kind: DiffKind.OBJECT, DiffObj]

export const diff = (prev: any, next: any): Diff => {
  const diffstring = (): Diff => {
    const diff = diffstr(prev, next)
    const identical = diff.length <= 1
    return identical ? [DiffKind.IDENTICAL] : [DiffKind.STRING, diff]
  }

  const diffobject = (): Diff => {
    const diff = diffobj(prev, next)
    const identical = !diff[0].length && !diff[1].length && !diff[2].length
    return identical ? [DiffKind.IDENTICAL] : [DiffKind.OBJECT, diff]
  }

  let diff: Diff
  if (isString(next)) diff = isString(prev) ? diffstring() : [DiffKind.STATIC, prev, next]
  else if (isObject(next)) diff = isObject(prev) ? diffobject() : [DiffKind.STATIC, prev, next]
  else if (isArray(next)) diff = isArray(prev) ? diffobject() : [DiffKind.STATIC, prev, next]
  else diff = prev === next ? [DiffKind.IDENTICAL] : [DiffKind.STATIC, prev, next]
  return cloneobj(diff)
}
