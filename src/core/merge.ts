import { Diff, diff } from './diff'
import { undo } from './undo'

export const merge = (currvalue: any, diffs: Diff[]) => {
  let prevalue = currvalue
  diffs.reverse().forEach(diff => (prevalue = undo(prevalue, diff)))
  return diff(prevalue, currvalue)
}
