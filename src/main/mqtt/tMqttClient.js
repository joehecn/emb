
/**
 * Promise 封装
 * 获取 connect 成功后的 mqtt 客户端
 */

import mqtt from 'mqtt'
import config from '../config/index.js'

const {
  WHERE_URL
} = config

const tMqttClient = where => {
  const url = WHERE_URL[where]

  return new Promise(resolve => {
    const client = mqtt.connect(url)
    client.on('connect', () => {
      resolve(client)
    })
  })
}

export default tMqttClient
