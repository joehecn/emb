
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    github: null,
    logining: false,
    user: {
      name: 'anonymous',
      token: '',
      isSuper: false
    },
    retainMsgs: [],
    // rMsgLen: 0,
    fMsgLen: 0,
    filterRMsgLen: 0,
    searchTopic: '',
    // for testing page
    testloading: false,
    testMsgs: [],
    topic: '',
    organize: '',
    organizes: [],
    datasources: [],
    devicepointObj: {},
    tznames: [],
    reportexcels: [],
    tables: [],
    headers: [],
    resHeaderNames: [],
    resTables: [],
    delayedJobs: [],
    jobCounts: {},
    dbConfigList: []
  },
  mutations: {
    setGithub (state, github) {
      state.github = github
    },
    setLogining (state, logining) {
      state.logining = logining
    },
    setUser (state, user) {
      state.user = user
    },
    pushToRetainMsgs (state, msg) {
      state.retainMsgs.push(msg)
      // state.rMsgLen = state.retainMsgs.length
    },
    emptyRetainMsgs (state) {
      state.retainMsgs = []
      // state.rMsgLen = 0
    },
    removeOneRetainMsg (state, topic) {
      for (let i = 0, len = state.retainMsgs.length; i < len; i++) {
        const it = state.retainMsgs[i]
        if (it.topic === topic) {
          state.retainMsgs.splice(i, 1)
          // state.rMsgLen = state.retainMsgs.length
          return
        }
      }
    },
    setFMsgLen (state, len) {
      state.fMsgLen = len
    },
    setFilterRMsgLen (state, len) {
      state.filterRMsgLen = len
    },
    updateSearchTopic (state, topic) {
      state.searchTopic = topic
    },
    setTestloading (state, testloading) {
      state.testloading = testloading
    },
    pushToTestMsgs (state, msg) {
      state.testMsgs.push(msg)
    },
    emptyTestMsgs (state) {
      state.testMsgs = []
    },
    setTopic (state, topic) {
      state.topic = topic
    },
    setOrganize (state, organize) {
      state.organize = organize
    },
    setOrganizes (state, organizes) {
      state.organizes = organizes
    },
    setDatasources (state, datasources) {
      state.datasources = datasources
    },
    setDevicepointObj (state, devicepointObj) {
      state.devicepointObj = devicepointObj
    },
    setTznames (state, tznames) {
      state.tznames = tznames
    },
    setReportexcels (state, reportexcels) {
      state.reportexcels = reportexcels
    },
    setTables (state, tables) {
      state.tables = tables
    },
    initHeaders (state, len) {
      state.headers = (new Array(len)).fill([])
      state.resHeaderNames = (new Array(len)).fill([])
      state.resTables = (new Array(len)).fill([])
      // }
    },
    setHeaders (state, { data, index, mark }) {
      const { headerArr, resHeaderName, resTable } = data

      const newHeader = headerArr.map(({ inField, inType }) => {
        let outField = inField
        let outType = ''
        let unit = ' '
        
        if (mark[inField]) {
          if (mark[inField].outField) outField = mark[inField].outField
          if (mark[inField].outType) outType = mark[inField].outType
          if (mark[inField].unit) unit = mark[inField].unit
        }

        return {
          inField,
          inType,
          outField,
          outType,
          unit
        }
      })
      state.headers.splice(index, 1, newHeader)

      state.resHeaderNames.splice(index, 1, resHeaderName)
      state.resTables.splice(index, 1, resTable)
    },
    updateHeaders (state, { value, index, rowIndex, field }) {
      const newHeader = state.headers[index]
      newHeader[rowIndex][field] = value
      state.headers.splice(index, 1, newHeader)
    },
    setDbConfig(state, { delayedJobs, jobCounts, list }) {
      state.delayedJobs = delayedJobs
      state.jobCounts = jobCounts
      state.dbConfigList = list
    },
    removeDbConfigListItem(state, _id) {
      for (let i = 0, len = state.dbConfigList.length; i < len; i++) {
        const item = state.dbConfigList[i]
        if (item._id === _id) {
          state.dbConfigList.splice(i, 1)
          return
        }
      }
    }
  },
  actions: {
    setLogining ({ commit }, logining) {
      commit('setLogining', logining)
    },
    setUser ({ commit }, user) {
      commit('setUser', user)
    },
    pushToRetainMsgs ({ commit }, msg) {
      commit('pushToRetainMsgs', msg)
    },
    emptyRetainMsgs({ commit }) {
      commit('emptyRetainMsgs')
    },
    removeOneRetainMsg({ commit }, topic) {
      commit('removeOneRetainMsg', topic)
    },
    setFMsgLen ({ commit }, len) {
      commit('setFMsgLen', len)
    },
    setFilterRMsgLen ({ commit }, len) {
      commit('setFilterRMsgLen', len)
    },
    updateSearchTopic({ commit }, topic) {
      commit('updateSearchTopic', topic)
    },
    setTestloading ({ commit }, testloading) {
      commit('setTestloading', testloading)
    },
    pushToTestMsgs ({ commit }, msg) {
      commit('pushToTestMsgs', msg)
    },
    emptyTestMsgs ({ commit }) {
      commit('emptyTestMsgs')
    },
    setTopic ({ commit }, topic) {
      commit('setTopic', topic)
    },
    setOrganize({ commit }, organize) {
      commit('setOrganize', organize)
    },
    setOrganizes({ commit }, organizes) {
      commit('setOrganizes', organizes)
    },
    setDatasources ({ commit }, datasources) {
      commit('setDatasources', datasources)
    },
    setDevicepointObj ({ commit }, devicepointObj) {
      commit('setDevicepointObj', devicepointObj)
    },
    setTznames ({ commit }, tznames) {
      commit('setTznames', tznames)
    },
    setReportexcels ({ commit }, reportexcels) {
      commit('setReportexcels', reportexcels)
    },
    setTables ({ commit }, tables) {
      commit('setTables', tables)
    },
    initHeaders ({ commit }, len) {
      commit('initHeaders', len)
    },
    setHeaders ({ commit }, obj) {
      commit('setHeaders', obj)
    },
    updateHeaders ({ commit }, obj) {
      commit('updateHeaders', obj)
    },
    setDbConfig ({ commit }, data) {
      commit('setDbConfig', data)
    },
    removeDbConfigListItem({ commit }, _id) {
      commit('removeDbConfigListItem', _id)
    }
  },
  getters: {
    transferDatasourceNames: state => {
      const arr = []
      const obj = {}
      const devicepointObj = state.devicepointObj
      if (Object.keys(devicepointObj).length === 0) {
        return { arr, obj }
      }

      for (let i = 0, len = state.datasources.length; i < len; i++) {
        const { devicePoint, name } = state.datasources[i]
        let _arr = []

        if (devicePoint && devicePoint.length === 2) {
          const [device, point] = devicePoint
          if (devicepointObj[device] && devicepointObj[device][point]) {
            const [dname, pname] = devicepointObj[device][point]
            _arr = [name, dname, pname]
            obj[name] = { dname, pname }
          }
        }

        arr.push({
          key: name,
          label: _arr.join('\n')
        })
      }

      return { arr, obj }
    }
  }
})

export default store
