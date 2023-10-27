import { diff } from '../src'

const one = { some: 'wooo mora' }
const two = { some: 'issi wooo', docha: true }

const d = diff(one, two)
console.log(JSON.stringify(d).length, JSON.stringify(d))
