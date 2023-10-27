import { AnyObject } from 'tn-typescript'
import { DiffObj } from './diffobj'
import { cloneobj } from 'tn-cloneobj'
import { deepobj } from 'tn-deepobj'
import { DiffStr } from './diffstr'
import { undostr } from './undostr'

export const undoobj = (curr: AnyObject, diff: DiffObj) => {
  const obj = cloneobj(curr)
  const [adds, rems, upds] = diff

  const dels = [...adds].reverse()
  dels.forEach(([path]) => deepobj.delete(obj, path))
  rems.forEach(([path, value]) => deepobj.set(obj, path, value))
  upds.forEach(upd => {
    const [path] = upd
    if (upd.length === 2) {
      const diff = upd[1] as DiffStr
      const nextval = undostr(deepobj.get(obj, path), diff)
      deepobj.set(obj, path, nextval)
    } else {
      const [, preval] = upd
      deepobj.set(obj, path, preval)
    }
  })

  return obj
}
