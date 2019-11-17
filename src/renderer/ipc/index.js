
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

  showSaveDialog(option) {
    ipcRenderer.send('show-save-dialog', option)
  }
}

export default ipc
