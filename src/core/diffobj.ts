import { AnyObject } from 'tn-typescript'
import { isArray, isObject, isString } from 'tn-validate'
import { DiffStr, diffstr } from './diffstr'
type Path = (string | number)[]
type DiffObjAdds = [P: Path, Value: any]
type DiffObjRems = [P: Path, Value: any]
type DiffObjUpds = [P: Path, Diff: DiffStr] | [P: Path, Prev: any, Value: any]
export type DiffObj = [DiffObjAdds[], DiffObjRems[], DiffObjUpds[]]

export const diffobj = (prev: AnyObject, next: AnyObject, path: Path = []): DiffObj => {
  const adds: DiffObjAdds[] = []
  const rems: DiffObjRems[] = []
  const upds: DiffObjUpds[] = []

  const array = isArray(next) && isArray(prev)
  const prevkeys = array ? Array.from({ length: prev.length }).map((_, i) => i) : Object.keys(prev)
  const nextkeys = array ? Array.from({ length: next.length }).map((_, i) => i) : Object.keys(next)
  let delkeys = prevkeys as (string | number)[]
  nextkeys.forEach((nextkey) => {
    const currpath = [...path, nextkey]
    if (!prevkeys.includes(nextkey as never)) return adds.push([currpath, next[nextkey]])
    delkeys = delkeys.filter((i) => i !== nextkey)
    const preval = prev[nextkey]
    const nextval = next[nextkey]
    if (isObject(nextval)) {
      if (!isObject(preval)) return upds.push([currpath, preval, nextval])
      const [a, r, u] = diffobj(preval, nextval, currpath)
      adds.push(...a)
      rems.push(...r)
      upds.push(...u)
    } else if (isArray(nextval)) {
      if (!isArray(preval)) return upds.push([currpath, preval, nextval])
      const [a, r, u] = diffobj(preval, nextval, currpath)
      adds.push(...a)
      rems.push(...r)
      upds.push(...u)
    } else if (isString(nextval)) {
      if (!isString(preval)) return upds.push([currpath, preval, nextval])
      if (preval === nextval) return
      upds.push([currpath, diffstr(preval, nextval)])
    } else {
      if (preval === nextval) return
      upds.push([currpath, preval, nextval])
    }
  })
  delkeys.forEach((delkey) => rems.push([[...path, delkey], prev[delkey]]))

  return [adds, rems, upds]
}
