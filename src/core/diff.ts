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

  if (isString(next)) {
    if (!isString(prev)) return [DiffKind.STATIC, prev, next]
    return diffstring()
  } else if (isObject(next)) {
    if (!isObject(prev)) return [DiffKind.STATIC, prev, next]
    return diffobject()
  } else if (isArray(next)) {
    if (!isArray(prev)) return [DiffKind.STATIC, prev, next]
    return diffobject()
  } else {
    if (prev === next) return [DiffKind.IDENTICAL]
    return [DiffKind.STATIC, prev, next]
  }
}
