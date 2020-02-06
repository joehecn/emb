
import { ipcRenderer } from 'electron'
import ctrlMsg from '../ctrlMsg/index.js'

ipcRenderer.on('main-send-test-mqtt', (_, msg) => {
  ctrlMsg({
    key: 'mainSendTestMqtt',
    ...msg})
})

ipcRenderer.on('main-send-mqtt', (_, msg) => {
  ctrlMsg({
    key: 'mainSendMqtt',
    ...msg})
})

ipcRenderer.on('main-msg', (_, msg) => {
  ctrlMsg(msg)
})

ipcRenderer.on('selected-file', (_, { type, filePath }) => {
  if (filePath) {
    ctrlMsg({
      key: 'saveExcel',
      type,
      filePath
    })
  }
})

const ipc = {
  send(msg) {
    ipcRenderer.send('renderer-msg', msg)
  },

  sendPromise(msg) {
    return new Promise(resolve => {
      const { key } = msg
      const time = Date.now()
      const eventName = `${key}-${time}`

      msg.eventName = eventName

      ipcRenderer.once(eventName, (_, msg) => {
        resolve(msg)
      })

      ipcRenderer.send('promise-msg', msg)
    })
  },

  showSaveDialog(option) {
    ipcRenderer.send('show-save-dialog', option)
  }
}

export default ipc
