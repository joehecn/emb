
import request from 'axios'
import config from '../config/index.js'
// import mySql from '../mysql/index.js'

const {
  API_BASC_URL
} = config

const api = {
  async sLogin (req) {
    const url = `${API_BASC_URL}/web/common/login`
    const { userName, password, abbreviation } = req

    const res = await request.post(url, {
      account: userName,
      password,
      abbreviation
    })

    // console.log(JSON.stringify(res.data, null, 2))

    return res.data
  },

  async sOrganizelist ({ token }) {
    const url = `${API_BASC_URL}/web/common/organizelist`
    const res = await request.get(url, {
      headers: {
        Authorization: token
      }
    })

    // console.log(JSON.stringify(res.data, null, 2))

    return res.data
  },

  async sDatasourcelist ({ token, db }) {
    const url = `${API_BASC_URL}/web/datasource/list/list`
    const res = await request.get(url, {
      headers: {
        Authorization: token,
        db
      }
    })

    // console.log(JSON.stringify(res.data, null, 2))

    return res.data
  },

  async sDevicepointcascade ({ token, db }) {
    const url = `${API_BASC_URL}/web/datasource/list/getdevicepointcascade`
    const res = await request.get(url, {
      headers: {
        Authorization: token,
        db
      }
    })

    // console.log(JSON.stringify(res.data, null, 2))

    return res.data
  },

  async sTznamelist ({ token }) {
    const url = `${API_BASC_URL}/web/project/list/tznamelist`
    const res = await request.get(url, {
      headers: {
        Authorization: token
      }
    })

    return res.data
  },

  async sReportExcelList({ token, db, names, dates, tzname, type }) {
    const url = `${API_BASC_URL}/web/trendlog/list/reportexcellist`
    const res = await request.post(url, {
      names, dates, tzname, type
    }, {
      headers: {
        Authorization: token,
        db
      }
    })

    return res.data
  },

  // async sTablelist({ connForm }) {
  //   // console.log(connForm)
  //   const { host, port, user, password, database } = connForm
  //   // try {
  //   const data = await mySql.findTables({ host, port, user, password, database })
  //   return { code: 0, data }
  //   // } catch (error) {
  //   //   return error
  //   // }
  // },

  // async sHeaderlist({ connForm, table, index, mark }) {
  //   // console.log(connForm)
  //   const { host, port, user, password, database } = connForm
  //   const conn = { host, port, user, password, database }
  //   // try {
  //   const headerArr = await mySql.findHeaders(conn, table)
  //   const { results: resTable, fields } = await mySql.find(conn, `SELECT * FROM ${table} LIMIT 1`)

  //   const resHeaderName = fields.map(item => item.name)
  //   // console.log(resHeaderName, resTable)

  //   return { code: 0, data: { headerArr, resHeaderName, resTable }, index, mark }
  //   // } catch (error) {
  //   //   return error
  //   // }
  // },

  async sFindTables({ token, db, arg }) {
    const url = `${API_BASC_URL}/super/grpc/findtables`

    const res = await request.post(url, arg, {
      headers: {
        Authorization: token,
        db
      }
    })

    // console.log(JSON.stringify(res.data, null, 2))
    return res.data
  },
  async sFindHeaders({ token, db, arg }) {
    const url = `${API_BASC_URL}/super/grpc/findheaders`

    const res = await request.post(url, arg, {
      headers: {
        Authorization: token,
        db
      }
    })

    // console.log(JSON.stringify(res.data, null, 2))
    return res.data
  },
  async sDbConfigList({ token, db }) {
    const url = `${API_BASC_URL}/super/grpc/list`

    const res = await request.get(url, {
      headers: {
        Authorization: token,
        db
      }
    })

    // console.log(JSON.stringify(res.data, null, 2))
    return res.data
  },

  async sDbConfigAdd({ token, db, arg }) {
    // try {
    const url = `${API_BASC_URL}/super/grpc/add`

    const res = await request.post(url, arg, {
      headers: {
        Authorization: token,
        db
      }
    })

    // console.log(JSON.stringify(res.data, null, 2))
    return res.data
    // } catch (error) {
    //   console.log(error)
    // }
  },

  async sDbConfigUpdate({ token, db, arg }) {
    const url = `${API_BASC_URL}/super/grpc/update`

    const res = await request.post(url, arg, {
      headers: {
        Authorization: token,
        db
      }
    })

    // console.log(JSON.stringify(res.data, null, 2))
    return res.data
  },

  async sDbConfigRemove({ token, db, arg }) {
    const url = `${API_BASC_URL}/super/grpc/remove`

    const res = await request.post(url, arg, {
      headers: {
        Authorization: token,
        db
      }
    })

    // console.log(JSON.stringify(res.data, null, 2))
    return res.data
  }
}

export default api
