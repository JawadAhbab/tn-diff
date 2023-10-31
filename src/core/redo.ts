import { cloneobj } from 'tn-cloneobj'
import { redoobj } from './accessories/redoobj'
import { redostr } from './accessories/redostr'
import { Diff, DiffKind } from './diff'

export const redo = <T>(curr: T, diff: Diff): T => {
  const [kind] = diff
  const currval = cloneobj(curr, true, false)

  let redoval: T
  if (kind === DiffKind.STATIC) redoval = diff[2]
  else if (kind === DiffKind.STRING) redoval = redostr(currval, diff[1])
  else if (kind === DiffKind.OBJECT) redoval = redoobj(currval, diff[1])
  else redoval = currval

  return cloneobj(redoval, true, false)
}
