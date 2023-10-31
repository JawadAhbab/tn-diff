import { deepobj } from 'tn-deepobj'
import { AnyObject } from 'tn-typescript'
import { DiffObj } from './diffobj'
import { DiffStr } from './diffstr'
import { undostr } from './undostr'

export const undoobj = <T>(curr: T, diff: DiffObj): T => {
  const currobj = curr as AnyObject
  const [adds, rems, upds] = diff
  const dels = [...adds].reverse()
  dels.forEach(([path]) => deepobj.delete(currobj, path))
  rems.forEach(([path, value]) => deepobj.set(currobj, path, value))
  upds.forEach(upd => {
    const [path] = upd
    if (upd.length === 2) {
      const diff = upd[1] as DiffStr
      const nextval = undostr(deepobj.get(currobj, path), diff)
      deepobj.set(currobj, path, nextval)
    } else {
      const preval = upd[1]
      deepobj.set(currobj, path, preval)
    }
  })

  return currobj as T
}
