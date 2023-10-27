import { diffobj } from '../src/core/diffobj'
import { undoobj } from '../src/core/undoobj'

const one = {
  some: 'done',
  more: true,
  bad: false,
  rem: true,
}

const two = {
  some: 'doza more done wooooo',
  more: false,
  bad: false,
  add: { one: 'one', two: 'two' },
  woo: ['one', 'two', 'three', 'four'],
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
console.log(undoone)
console.log(undotwo)
