import { diffobj } from '../src/core/diffobj'

const paraOne = {
  person: { name: 'John Doe', age: 30, isStudent: false },
  address: { street: '123 Main Street', city: 'Anytown', zipcode: '12345' },
  hobbies: ['reading', 'docha', 'photography', 'hiking'],
  contacts: [
    { type: 'email', value: 'john.doe@example.com' },
    { type: 'phone', value: '555-123-4567' },
  ],
}
const paraTwo = {
  person: { name: 'John Doe', age: 30, isStudent: false },
  address: { street: '123 Main Street', city: 'Anytown', zipcode: '12345' },
  hobbies: ['reading', 'docha', 'photography', 'hiking'],
  contacts: [
    { type: 'email', value: 'john.doe@example.com' },
    { type: 'phone', value: '67738367' },
  ],
}

// const paraOne = {
//   one: [1, true, false, { woo: true }],
//   two: 'more',
// }

// const paraTwo = {
//   one: [2, true, false, { woo: true, mocha: false }],
//   three: 'more',
// }

const diff = diffobj(paraOne, paraTwo)
console.log(diff[0])
console.log(diff[1])
console.log(diff[2])
console.log(JSON.stringify(diff).length, JSON.stringify(diff))
