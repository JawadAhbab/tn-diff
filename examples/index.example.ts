import { diff, undo } from '../src'

const one = { some: 'wokring more foss' }
const two = { more: 'working better more' }

const d = diff(one, two)

console.log(undo(two, d))
