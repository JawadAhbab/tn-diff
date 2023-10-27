import { diffobj } from '../src/core/diffobj'
import { undoobj } from '../src/core/undoobj'
import { redoobj } from '../src/core/redoobj'

const one = {
  some: 'done',
  more: true,
  bad: false,
  rem: true,
}

const two = {
  some: 'doza more done wooooo',
  more: 'false',
  bad: false,
  add: { one: 'one', two: 'two', three: 'sss' },
  woo: ['one', 'five', 'six', 'two'],
}

const three = {
  some: 'more done udosas',
  more: false,
  bad: true,
  add: { one: 'one', three: 'two' },
  woo: ['one', 'two'],
  doo: true,
}

const diffone = diffobj(one, two)
const difftwo = diffobj(two, three)
console.log(diffone)
console.log(difftwo)

const undoone = undoobj(three, difftwo)
const undotwo = undoobj(undoone, diffone)
console.log(3, three)
console.log(2, undoone)
console.log(1, undotwo)

const redoone = redoobj(undotwo, diffone)
const redotwo = redoobj(redoone, difftwo)
console.log(1, undotwo)
console.log(2, redoone)
console.log(3, redotwo)
