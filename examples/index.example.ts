import { diff } from '../src'

const one = true
const two = true

const d = diff(one, two)
console.log(JSON.stringify(d).length, JSON.stringify(d))
