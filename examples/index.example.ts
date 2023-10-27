import { diff, redo } from '../src'

const one = { some: 'wokring more foss', more: 'working' }
const two = { more: 'working better more' }

const d = diff(one, two)

console.log(redo(one, d))
