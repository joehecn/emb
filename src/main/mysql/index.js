
// 1. 一般查询
// find(conn, 'SELECT COUNT(*) AS count FROM ecfan')
//   .then(res => console.log(res))
//   .catch(error => console.log(error))

// 1. 查找所有的 Table
// find(conn, `
// SELECT table_name
// FROM information_schema.tables
// WHERE table_schema = 'haeco'
// `)
//   .then(res => console.log(res))
//   .catch(error => console.log(error))

// 2. 获取 header 字段
// find(conn, 'SHOW COLUMNS FROM ecfan')
//   .then(res => console.log(res))
//   .catch(error => console.log(error))

import mysql from 'mysql2/promise'

// conn: {
//   host: 'localhost',
//   user: 'root',
//   password : 'haeco',
//   database: 'haeco'
// }
const find = async (conn, query) => {
  let connection = null
  try {
    const connection = await mysql.createConnection(conn)
    
    connection.on('error', () => {
      connection.end()
    })
  
    connection.connect()

    const [results, fields] = await connection.query(query)
  
    connection.end()

  
    return { results, fields }
  } catch (error) {
    connection && connection.end()
    throw error
  }
}

const findTables = async conn => {
  const query = `
SELECT table_name
FROM information_schema.tables
WHERE table_schema = '${conn.database}'
  `.trim()

  const { results } = await find(conn, query)
  // console.log({ results })

  // 把所有的key 转 小写
  // TABLE_NAME => table_name
  const res = results.map(item => {
    const obj = {}
    for (let key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        obj[key.toLowerCase()] = item[key]
      }
    }
    return obj
  })
  // console.log({ res })

  return res.map(item => item.table_name)
}

const findHeaders = async (conn, tableName) => {
  const query = `SHOW COLUMNS FROM ${tableName}`

  const { results } = await find(conn, query)
  console.log(results)

  return results.map(({
    Field: inField,
    Type: inType
  }) => ({
    inField,
    inType
  }))
}

export default {
  find,
  findTables,
  findHeaders
}
