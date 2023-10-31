import { deepobj } from 'tn-deepobj'
import { AnyObject } from 'tn-typescript'
import { DiffObj } from './diffobj'
import { DiffStr } from './diffstr'
import { redostr } from './redostr'

export const redoobj = <T>(curr: T, diff: DiffObj): T => {
  const currobj = curr as AnyObject
  const [adds, rems, upds] = diff
  const dels = [...rems].reverse()
  dels.forEach(([path]) => deepobj.delete(currobj, path))
  adds.forEach(([path, value]) => deepobj.set(currobj, path, value))
  upds.forEach(upd => {
    const [path] = upd
    if (upd.length === 2) {
      const diff = upd[1] as DiffStr
      const nextval = redostr(deepobj.get(currobj, path), diff)
      deepobj.set(currobj, path, nextval)
    } else {
      const preval = upd[2]
      deepobj.set(currobj, path, preval)
    }
  })

  return currobj as T
}
