
import {
  Notification
} from 'element-ui'
import store from '../store/index.js'
import router from '../router/index.js'
import config from '../config/index.js'
import excel from '../excel/index.js'
import moment from 'moment'

const _getIsSuper = data => {
  const abbr = data.user && data.user.organize && data.user.organize.abbreviation

  if (abbr === config.ORGANIZE_ABBR) {
    let _isSuper = data.user && data.user.role && data.user.role.isSuper
    if (_isSuper) return true
  }

  return false
}

const methods = {
  login({ body, req }) {
    store.dispatch('setLogining', false)

    const { code, message, data } = body

    if (code === 0) {
      const user = {
        name: (data.user && data.user.userName) || 'anonymous',
        token: data.token || '',
        isSuper: _getIsSuper(data)
      }
      store.dispatch('setUser', user)

      router.replace(req.redirect)
    } else {
      Notification.error({
        position: 'bottom-left',
        title: code,
        message
      })
    }
  },

  organizelist({ body }) {
    const { code, data } = body

    if (code === 0) {
      const organizes = data.map(({ _id, name }) => {
        return {
          value: _id,
          label: name
        }
      })
      store.dispatch('setOrganizes', organizes)
    }
  },

  datasourcelist({ body }) {
    const { code, data } = body

    if (code === 0) {
      // console.log(data)
      store.dispatch('setDatasources', data)
    }
  },
  devicepoint({ body }) {
    const { code, data } = body
    if (code === 0) {
      // console.log(data)
      const devicepointObj = {}
      for (let i = 0, ilen = data.length; i < ilen; i++) {
        const { value, label, children } = data[i]
        devicepointObj[value] = {}

        for (let j = 0, jlen = children.length; j < jlen; j++) {
          const item = children[j]
          devicepointObj[value][item.value] = [label, item.label]
        }
      }

      store.dispatch('setDevicepointObj', devicepointObj)
    }
  },

  tznamelist ({ body }) {
    const { code, data } = body

    if (code === 0) {
      // console.log({ data })
      store.dispatch('setTznames', data)
    }
  },

  reportexcellist ({ body }) {
    const { code, data } = body

    if (code === 0) {
      console.log(data)
      const obj = store.getters.transferDatasourceNames.obj

      const _data = data.map(({ name, time, original, value }) => {
        let dname = ''
        let pname = ''
        if (obj[name]) {
          dname = obj[name]['dname']
          pname = obj[name]['pname']
        }

        time = moment(time).format('YYYY-MM-DD HH:mm')
        return { name, dname, pname, time, original, value }
      })
      console.log(_data)
      store.dispatch('setReportexcels', _data)
    }
  },

  createRetainClient({ body, req }) {
    console.log('ctrlMsg createRetainClient', { body, req  })
  },

  removeRetainClient({ body, req }) {
    console.log('ctrlMsg removeRetainClient', { body, req  })
  },

  createAcceptClient({ body, req }) {
    console.log('ctrlMsg createAcceptClient', { body, req  })
  },

  removeAcceptClient({ body, req }) {
    console.log('ctrlMsg removeAcceptClient', { body, req  })
  },

  mainSendMqtt ({ topic, payload }) {
    store.dispatch('pushToRetainMsgs', {
      topic,
      payload,
      removeing: false
    })
  },

  mainSendTestMqtt ({ item }) {
    store.dispatch('pushToTestMsgs', item)
  },

  removeRetainMsg ({ body, req }) {
    const { code, message } = body

    if (code === 0) {
      // remove item
      const { topic } = req

      store.dispatch('removeOneRetainMsg', topic)
    } else {
      Notification.error({
        position: 'bottom-left',
        title: code,
        message
      })
    }
  },

  runTesting ({ body, req }) {
    console.log('------- ctrlMsg runTesting', { body, req })

    store.dispatch('setTestloading', false)
  },

  closeTesting({ body, req }) {
    console.log('ctrlMsg closeTesting', { body, req  })
  },

  saveExcel({ type, filePath }) {
    console.log({ type, filePath })
    // [{
    //   back: 1567336698840
    //   clientIndex: 6
    //   ms: 15
    //   runIndex: 0
    //   send: 1567336698825
    //   topic: "EMB_PerformanceTesting/joe_1567336694456/0/6"
    // }]
    if (type === 0) {
      const datas = store.state.testMsgs.map(({
        clientIndex,
        runIndex,
        ms,
        send,
        back,
        topic
      }) => {
        return {
          clientIndex,
          runIndex,
          ms,
          send: moment(send).format('YYYY-MM-DD HH:mm:ss.SSS'),
          back: moment(back).format('YYYY-MM-DD HH:mm:ss.SSS'),
          topic
        }
      })
      const header = {
        header: [
          'clientIndex',
          'runIndex',
          'ms',
          'send',
          'back',
          'topic'
        ]
      }
      const sheetName = 'messagelist'
      excel.downloadJsonToSheet(datas, header, filePath, sheetName)
    } else {
      const datas = store.state.reportexcels.map(({
        name, dname, pname, time, original, value
      }, index) => {
        return {
          'SN': index + 1,
          'Time': time,
          'Data source': name,
          'Device name': dname,
          'Point name': pname,
          'Original': original,
          'Value': value
        }
      })
      const header = {
        header: [
          'SN',
          'Time',
          'Data source',
          'Device name',
          'Point name',
          'Original',
          'Value'
        ]
      }
      const sheetName = 'report'
      excel.downloadJsonToSheet(datas, header, filePath, sheetName)
    }
  }
}
const ctrlMsg = msg => {
  try {
    methods[msg.key](msg)
  } catch (error) {
    console.log('---- ctrlMsg error')
    console.log(error)
  }
}

export default ctrlMsg
