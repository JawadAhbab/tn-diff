import { isNumber } from 'tn-validate'
import { DiffStr } from './diffstr'

export const redostr = (curr: string, diff: DiffStr) => {
  const prev: string[] = []
  const currarr = curr.split('')

  diff.forEach((df) => {
    if (isNumber(df)) return prev.push(...currarr.splice(0, df))
    const [change, string] = df
    if (change === 1) return prev.push(string)
    currarr.splice(0, string.length)
  })

  return prev.join('')
}
