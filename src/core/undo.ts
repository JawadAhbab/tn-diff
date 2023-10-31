import { cloneobj } from 'tn-cloneobj'
import { undoobj } from './accessories/undoobj'
import { undostr } from './accessories/undostr'
import { Diff, DiffKind } from './diff'

export const undo = <T>(curr: T, diff: Diff): T => {
  const [kind] = diff
  const currval = cloneobj(curr, true, false)

  let undoval: T
  if (kind === DiffKind.STATIC) undoval = diff[1]
  else if (kind === DiffKind.STRING) undoval = undostr(currval, diff[1])
  else if (kind === DiffKind.OBJECT) undoval = undoobj(currval, diff[1])
  else return currval

  return cloneobj(undoval, true, false)
}
