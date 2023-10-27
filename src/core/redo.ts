import { redoobj } from './accessories/redoobj'
import { redostr } from './accessories/redostr'
import { Diff, DiffKind } from './diff'

export const redo = (curr: any, diff: Diff) => {
  const [kind] = diff
  if (kind === DiffKind.STATIC) return diff[2]
  if (kind === DiffKind.STRING) return redostr(curr, diff[1])
  if (kind === DiffKind.OBJECT) return redoobj(curr, diff[1])
  return curr
}
