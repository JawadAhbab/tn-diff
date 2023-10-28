import { diff, distance } from '../src'

const one = { one: 'some more', two: 1 }
const two = { one: 'some', twos: 2 }

const d = diff(one, two)
console.log(JSON.stringify(d))

console.log(distance(d))
