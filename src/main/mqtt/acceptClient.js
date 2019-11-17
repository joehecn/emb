
/**
 * Promise 封装
 * 获取 connect 成功后的 mqtt 客户端
 */

import mqtt from 'mqtt'
import config from '../config/index.js'

const {
  WHERE_URL
} = config

let _uClient = null

const _cleateClient = (where, topic, method) => {
  const url = WHERE_URL[where]

  return new Promise(resolve => {
    const client = mqtt.connect(url)

    client.on('message', method)

    client.on('connect', () => {
      client.subscribe(topic)
      resolve(client)
    })
  })
}

const getAcceptClient = async (where, topic, method) => {
  if (_uClient === null) {
    _uClient = await _cleateClient(where, topic, method)
  }
  return _uClient
}

const closeAcceptClient = () => {
  _uClient && _uClient.end(true)
  _uClient = null
}

export default {
  getAcceptClient,
  closeAcceptClient
}
