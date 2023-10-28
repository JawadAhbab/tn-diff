import { Diff } from './diff'
import { distance } from './distance'
import { merge } from './merge'
type R = { merged: boolean; diff: Diff }

export const mergeable = (maxdistance: number, currvalue: any, d1: Diff, d2: Diff): R => {
  if (distance(d2) > maxdistance) return { merged: false, diff: d2 }
  const dm = merge(currvalue, [d1, d2])
  if (distance(dm) > maxdistance) return { merged: false, diff: d2 }
  return { merged: true, diff: dm }
}
