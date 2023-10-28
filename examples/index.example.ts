import { diff, mergeable } from '../src'

const one = { one: 'some', two: 1 }
const two = { one: 'some', two: 2 }
const three = { one: 'some', two: 30 }

const d1 = diff(one, two)
const d2 = diff(two, three)

console.log(mergeable(1, three, d1, d2))
