import { diffWords } from 'diff'
export type DiffMin = (DiffMinChange | number)[]
export type DiffMinChange = [1 | -1, string]

export const diffstr = (prev: string, next: string) => {
  return diffWords(prev, next).map<DiffMin[number]>((d) => {
    if (d.added) return [1, d.value]
    if (d.removed) return [-1, d.value]
    return d.value.length
  })
}
