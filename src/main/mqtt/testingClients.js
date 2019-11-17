
/**
 * 全局单例
 */
import tMqttClient from './tMqttClient.js'

let _clients = []

const _sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const _destroyClient = _client => {
  _client && _client.end(true)
  _client = null
}

const closeTClients = () => {
  for (let i = 0, len = _clients.length; i < len; i++) {
    const _client = _clients[i]
    _destroyClient(_client)
  }
  _clients = []
}

const _run = (j, uniqueid) => {
  for (let i = 0, len = _clients.length; i < len; i++) {
    const _client = _clients[i]

    const topic = `EMB_PerformanceTesting/${uniqueid}/${j}/${i}`
    const payloadStr = JSON.stringify({
      runIndex: j,
      clientIndex: i,
      send: Date.now()
    })
    _client && _client.publish(topic, payloadStr, {
      qos: 2,
      retain: false
    })
  }
}
const _startRun = async (runNum, uniqueid) => {
  for (let j = 0; j < runNum; j++) {
    _run(j, uniqueid)
    await _sleep(1000) // 休眠 1000 毫秒
  }
} 
const runTClients = async req => {
  // 加固
  closeTClients()

  const { clientNum, runNum, where, uniqueid } = req

  // init
  for (let i = 0; i < clientNum; i++) {
    const _client = await tMqttClient(where)

    _clients.push(_client)
  }

  // run
  await _startRun(runNum, uniqueid)
}

export default {
  runTClients,
  closeTClients
}
