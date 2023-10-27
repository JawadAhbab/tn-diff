import { diffstr } from '../src/core/diffstr'
import { undostr } from '../src/core/undostr'

const one = 'mocha docha locha uku'
const two = 'docha uku locha'
const three = 'docha uku mocha docha locha'
const four = 'docha mocha docha uku locha'

const diffone = diffstr(one, two)
const difftwo = diffstr(two, three)
const diffthree = diffstr(three, four)

console.log(JSON.stringify(diffone))
console.log(JSON.stringify(difftwo))
console.log(JSON.stringify(diffthree))

const undoone = undostr(four, diffthree)
const undotwo = undostr(undoone, difftwo)
const undothree = undostr(undotwo, diffone)
console.log(four)
console.log(undoone)
console.log(undotwo)
console.log(undothree)
