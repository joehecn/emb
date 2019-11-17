
import request from 'axios'
import config from '../config/index.js'

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
  }
}

export default api
