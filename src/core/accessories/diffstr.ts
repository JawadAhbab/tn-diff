import { diffWords } from 'diff'
type DiffStrChange = [1 | -1, string]
export type DiffStr = (DiffStrChange | number)[]

export const diffstr = (prev: string, next: string) => {
  return diffWords(prev, next).map<DiffStr[number]>((d) => {
    if (d.added) return [1, d.value]
    if (d.removed) return [-1, d.value]
    return d.value.length
  })
}
