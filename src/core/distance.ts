import { isBoolean, isNumber } from 'tn-validate'
import { DiffStr } from './accessories/diffstr'
import { Diff, DiffKind } from './diff'

export const distance = (diff: Diff) => {
  const strdist = (strdiff: DiffStr) => {
    const changes = strdiff.reduce<number>((a, b) => a + (isNumber(b) ? 0 : 1), 0)
    return Math.min(changes, 10)
  }

  const staticdist = (v1: any, v2: any) => {
    if (isBoolean(v1) && isBoolean(v2)) return 1
    if (isNumber(v1) && isNumber(v2)) return 1
    return 10
  }

  const [kind] = diff
  if (kind === DiffKind.STRING) {
    const [, strdiff] = diff
    return strdist(strdiff)
  } else if (kind === DiffKind.OBJECT) {
    let dist = 0
    const [, [adds, rems, upds]] = diff
    dist += adds.length * 10
    dist += rems.length * 10
    upds.forEach(u => (dist += u.length === 2 ? strdist(u[1]) : staticdist(u[1], u[2])))
    return dist
  } else if (kind === DiffKind.STATIC) {
    const [, v1, v2] = diff
    return staticdist(v1, v2)
  }

  return 0
}
