
/**
 * 全局单例
 */
import RMqttClient from './RMqttClient.js'

let _retainClient = null

const getRetainClient = (where, win) => {
  /* istanbul ignore else */
  if (_retainClient === null) {
    // console.log('------ getRetainClient _retainClient null')
    _retainClient = new RMqttClient(where)

    _retainClient.on('emit-mqtt', msg => {
      // 主动向客户端 push 消息
      win.webContents.send('main-send-mqtt', msg)
    })

    _retainClient.init([
      '#'
    ])
  } /* else { do nothing } */

  return _retainClient
}

const removeRetain = (topic, cb) => {
  // console.log('---- 1 removeRetain', topic)
  _retainClient && _retainClient.removeRetain(topic, cb)
}

const closeRetainClient = () => {
  // console.log('------------- closeRetainClient')
  /* istanbul ignore else */
  if (_retainClient) {
    // console.log('------------- closeRetainClient set _retainClient null')
    _retainClient.destroy()
    _retainClient = null
  } /* else { do nothing } */
}

export default {
  getRetainClient,
  removeRetain,
  closeRetainClient
}
