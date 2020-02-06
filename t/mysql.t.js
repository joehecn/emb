
const {
  findTables
  // findHeaders
} = require('../src/main/mysql/index.js')

const conn = {
  host: 'localhost',
  user: 'root',
  password : 'haec',
  database: 'haeco'
}

findTables(conn)
  .then(tables => console.log({ tables }))
  .catch(error => console.log({ error }))
// findHeaders(conn, 'ecfan').then(headers => console.log({ headers }))
