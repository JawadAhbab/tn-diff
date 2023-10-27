import { isArray, isObject, isString } from 'tn-validate'
import { DiffObj, diffobj } from './accessories/diffobj'
import { DiffStr, diffstr } from './accessories/diffstr'
export enum DiffKind {
  STRING,
  OBJECT,
  STATIC,
}
export type Diff =
  | []
  | [Kind: DiffKind.STATIC, Prev: any, Value: any]
  | [Kind: DiffKind.STRING, DiffStr]
  | [Kind: DiffKind.OBJECT, DiffObj]

export const diff = (prev: any, next: any): Diff => {
  if (isString(next)) {
    if (!isString(prev)) return [DiffKind.STATIC, prev, next]
    return [DiffKind.STRING, diffstr(prev, next)]
  } else if (isObject(next)) {
    if (!isObject(prev)) return [DiffKind.STATIC, prev, next]
    return [DiffKind.OBJECT, diffobj(prev, next)]
  } else if (isArray(next)) {
    if (!isArray(prev)) return [DiffKind.STATIC, prev, next]
    return [DiffKind.OBJECT, diffobj(prev, next)]
  } else {
    if (prev === next) return []
    return [DiffKind.STATIC, prev, next]
  }
}
