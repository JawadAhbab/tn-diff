import { chardiff } from '../src/index'

const paraOne = `{"person":{"name":"John Doe","age":30,"isStudent":false},"address":{"street":"123 Main Street","city":"Anytown","zipcode":"12345"},"hobbies":["reading","hiking","photography"],"contacts":[{"type":"email","value":"john.doe@example.com"},{"type":"phone","value":"555-123-4567"}]}`
const paraTwo = `{"person":{"name":"John Doe","age":30,"isStudent":false},"address":{"street":"123 Main Street","city":"Anytown","zipcode":"12345"},"hobbies":["reading","hiking","photography"],"employment":{"company":"ABC Corporation","position":"Software Engineer","yearsWorked":5}}`

const diff = chardiff(paraOne, paraTwo)
console.log(JSON.stringify(diff).length)
console.log(JSON.stringify(diff))
console.log(diff)
