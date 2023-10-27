import { undoobj } from './accessories/undoobj'
import { undostr } from './accessories/undostr'
import { Diff, DiffKind } from './diff'

export const undo = (curr: any, diff: Diff) => {
  const [kind] = diff
  if (kind === DiffKind.STATIC) return diff[1]
  if (kind === DiffKind.STRING) return undostr(curr, diff[1])
  if (kind === DiffKind.OBJECT) return undoobj(curr, diff[1])
  return curr
}
