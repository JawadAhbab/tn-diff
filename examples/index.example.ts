import { diff, redo } from '../src'

const one = '{ same: true }'
const two = '{ same: true }'

const d = diff(one, two)

console.log(JSON.stringify(d))
