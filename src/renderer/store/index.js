
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
    organizes: [],
    datasources: [],
    devicepointObj: {},
    tznames: [],
    reportexcels: []
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

      // const arr = state.datasources.map(({ devicePoint, name }) => {
      //   let arr = []

      //   if (devicePoint && devicePoint.length === 2) {
      //     const [device, point] = devicePoint
      //     if (devicepointObj[device] && devicepointObj[device][point]) {
      //       const [dname, pname] = devicepointObj[device][point]
      //       arr = [name, dname, pname]
      //     }
      //   }

      //   return {
      //     key: name,
      //     label: arr.join('\n')
      //   }
      // })

      return { arr, obj }
    }
  }
})

export default store
