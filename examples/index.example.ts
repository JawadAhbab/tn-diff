import { diff, diffmerge } from '../src'

const one = { one: 1 }
const two = { one: 1, two: 2 }
const three = { one: 2, two: 2, three: 3 }
const four = { one: 2, two: 2, three: 2, four: 4 }

const d1 = diff(one, two)
const d2 = diff(two, three)
const d3 = diff(three, four)

console.log(JSON.stringify(d1))
console.log(JSON.stringify(d2))
console.log(JSON.stringify(d3))
console.log('----')

const dm = diffmerge(four, [d1, d2, d3])
console.log(JSON.stringify(dm))
