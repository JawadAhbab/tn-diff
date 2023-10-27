import { cloneobj } from 'tn-cloneobj'
import { deepobj } from 'tn-deepobj'
import { AnyObject } from 'tn-typescript'
import { DiffObj } from './diffobj'
import { DiffStr } from './diffstr'
import { redostr } from './redostr'
const clone = (value: any) => cloneobj(value, true, false)

export const redoobj = (curr: AnyObject, diff: DiffObj) => {
  const obj = clone(curr)
  const [adds, rems, upds] = diff

  const dels = [...rems].reverse()
  dels.forEach(([path]) => deepobj.delete(obj, path))
  adds.forEach(([path, value]) => deepobj.set(obj, path, clone(value)))
  upds.forEach(upd => {
    const [path] = upd
    if (upd.length === 2) {
      const diff = upd[1] as DiffStr
      const nextval = redostr(deepobj.get(obj, path), diff)
      deepobj.set(obj, path, clone(nextval))
    } else {
      const preval = upd[2]
      deepobj.set(obj, path, clone(preval))
    }
  })

  return obj
}
