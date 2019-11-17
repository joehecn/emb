
import Emitter from 'events'
import mqtt from 'mqtt'
import config from '../config/index.js'

const {
  WHERE_URL
} = config

class RMqttClient extends Emitter {
  constructor(where) {
    super()
    this.where = where
  }
  init (topicArr) {
    const url = WHERE_URL[this.where]
    const client = mqtt.connect(url)

    client.on('message', (topic, payload, packet) => {
      // 监控所有硬件状态改变消息
      if (packet.retain) {
        this.emit('emit-mqtt', { topic, payload: payload.toString() })
      }
    })

    client.on('connect', () => {
      for (let i = 0, len = topicArr.length; i < len; i++) {
        const topic = topicArr[i]
        client.subscribe(topic)
      }
    })

    this.client = client
  }

  // 发布一条保留的空消息，达到删除保留消息的效果
  removeRetain (topic, cb) {
    // console.log('---- 2 removeRetain', topic)
    this.client.publish(
      topic,
      null,
      {
        retain: true
      },
      function (err) {
        cb && cb(err)
      }
    )
  }

  destroy () {
    this.client.end(true)
    this.client = null
  }
}

export default RMqttClient
