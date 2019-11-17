
<template>
  <div id="testing">
    <div class="content">
      <div class="setting">
        <el-input-number
          controls-position="right"
          v-model="clientNum"
          step-strictly
          :precision="0"
          :step="1"
          :min="10" :max="100" placeholder="Virtual Clients"></el-input-number>
        <el-input-number
          class="runnum-input"
          controls-position="right"
          v-model="runNum"
          step-strictly
          :precision="0"
          :step="1"
          :min="10" :max="100" placeholder="Number Of Runs"></el-input-number>
        <el-button
          class="start-btn"
          type="primary"
          :loading="testloading"
          @click="startRun">start</el-button>
      </div>

      <div class="main">
        <!-- <div v-show="state !== ''"> -->
        <el-alert
          :title="state"
          type="success"
          :closable="false">
        </el-alert>
        <div class="up">
          <div class="item">
            <p>Requests</p>
            <p>{{ requests }}</p>
          </div>
          <div class="item">
            <p>Responses</p>
            <p>{{ responses }}</p>
          </div>
          <div class="item">
            <p>Max response time</p>
            <p>{{ resMax }} ms</p>
          </div>
          <div class="item">
            <p>Avg response time</p>
            <p>{{ resAvg }} ms</p>
          </div>
          <div class="item">
            <p>Min response time</p>
            <p>{{ resMin }} ms</p>
          </div>
        </div>
        <div id="chart"></div>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

// 节流
function throttle (fn, delay) {
  let timer = null
  let remaining = 0
  let previous = new Date()

  return function () {
    let now = new Date()
    let remaining = now - previous
    let args = arguments
    let context = this

    if (remaining >= delay) {
      if (timer) {
        clearTimeout(timer)
      }

      fn.apply(context, args)
      previous = now
    } else {
      if (!timer) {
        timer = setTimeout(function () {
          fn.apply(context, args)
          previous = new Date()
        }, delay - remaining)
      }
    }
  }
}

export default {
  data() {
    return {
      uniqueid: '',
      clientNum: undefined,
      runNum: undefined,
      responses: 0,
      resMax: 0,
      resAvg: 0,
      resMin: 0,
      state: 'State: Waiting...'
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      testloading: state => state.testloading,
      testMsgs: state => state.testMsgs
    }),
    requests() {
      const _clientNum = this.clientNum || 0
      const _runNum = this.runNum || 0
      return _clientNum * _runNum
    }
  },
  watch: {
    testMsgs () {
      // TODO: 改进算法
      if (this.testMsgs.length === this.requests) {
        // 保证数据和视图一致
        console.log('--- latest refresh view')
        this.state = 'State: Ready'
        this.refreshView()
      } else {
        this.state = 'State: Running...'
        this._throttle()
      }
    }
  },
  mounted() {
    this._throttle = throttle(() => {
      console.log('--- throttle refresh view')
      this.refreshView()
    }, 1000)

    // init
    this.setTestloading(false)
    this.emptyTestMsgs()
    this.state = 'State: Waiting...'

    // 创建 mqtt 客户端
    const _timestamp = Date.now()
    this.uniqueid = `${this.user.name}_${_timestamp}`
    this.setTopic(`EMB_PerformanceTesting/${this.uniqueid}/+/+`)
    const msg = {
      key: 'createAcceptClient',
      req: {
        where: 'hardware',
        uniqueid: this.uniqueid
      }
    }
    this.$$ipc.send(msg)

    this.myChart = this.$$echarts.init(document.getElementById('chart'))
    const that = this
    this.myChart.setOption({
      title: {
        text: 'Response time',
        x:'left',
        y:'top'
      },
      legend: {
        // top: -4,
        // left: 0
        // orient: 'vertical'
      },
      tooltip: {},
      toolbox: {
        show: true,
        right: 30,
        // showTitle: false, // 隐藏默认文字，否则两者位置会重叠
        feature: {
          saveAsImage: {
            show: true,
            title: 'Save As Image'
          },
          mySaveAsExcel: {
            show: true,
            title: 'Save As Excel',
            icon: 'path://M682.666667 85.333333l213.333333 213.333334v597.674666a42.368 42.368 0 0 1-42.368 42.325334H170.368A42.666667 42.666667 0 0 1 128 896.341333V127.658667C128 104.277333 146.986667 85.333333 170.368 85.333333H682.666667z m-128 426.666667V341.333333h-85.333334v170.666667H341.333333l170.666667 170.666667 170.666667-170.666667h-128z',
            onclick() {
              // 弹出文件夹选框
              that.$$ipc.showSaveDialog({
                type: 0,
                defaultPath: 'PerformanceTesting.xlsx'
              })
            }
          }
        }
      },
      dataset: {
        dimensions: ['index', 'min', 'avg', 'max'],
        source: {
          index: [],
          min: [],
          avg: [],
          max: []
        }
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        name: 'ms'
      },
      dataZoom: [
        {
            type: 'slider',
            show: true,
            xAxisIndex: [0]
            // end: 50
        },
        {
            type: 'slider',
            show: true,
            yAxisIndex: [0]
            // right: 32
            // bottom: 56
            // start: 1,
            // end: 50
        }
        // {
        //   type: 'inside',
        //   yAxisIndex: [0],
        //   start: 1,
        //   end: 50
        // }
      ],
      series: [
        {
          type: 'line',
          name: 'min',
          encode: {
            x: 0,
            y: 1
          }
        },
        {
          type: 'line',
          name: 'avg',
          encode: {
            x: 0,
            y: 2
          }
        },
        {
          type: 'line',
          name: 'max',
          encode: {
            x: 0,
            y: 3
          }
        }
      ]
    })
  },
  beforeDestroy() {
    // 销毁 mqtt 客户端
    const msg1 = {
      key: 'removeAcceptClient',
      req: {}
    }
    this.$$ipc.send(msg1)

    const msg2 = {
      key: 'closeTesting',
      req: {}
    }
    this.$$ipc.send(msg2)
  },
  methods: {
    ...mapActions([
      'setTestloading',
      'emptyTestMsgs',
      'setTopic'
    ]),
    startRun() {
      if (this.clientNum >= 10 && this.runNum >= 10 &&
        this.clientNum <= 100 && this.runNum <= 100) {
        this.setTestloading(true)
        this.emptyTestMsgs()
        this.state = 'State: Init clients'

        const msg = {
          key: 'runTesting',
          req: {
            clientNum: this.clientNum,
            runNum: this.runNum,
            where: 'hardware',
            uniqueid: this.uniqueid
          }
        }

        this.$$ipc.send(msg)
      }
    },

    getAvg(arr) {
      if (arr.length === 0) return 0
      const sum = arr.reduce((acc, cur) => acc + cur, 0)
      return (sum / arr.length).toFixed(2)
    },
    getData() {
      const runObj = {}
      const msArr = []

      for (let i = 0, len = this.testMsgs.length; i < len; i++) {
        const { runIndex, ms } = this.testMsgs[i]
        if (!runObj[runIndex]) runObj[runIndex] = []
        runObj[runIndex].push(ms)

        msArr.push(ms)
      }

      // 排序
      for (let key in runObj) {
        runObj[key].sort((a, b) => {
          return a - b
        })
      }
      msArr.sort((a, b) => {
        return a - b
      })

      // console.log(JSON.stringify(runObj, null, 2))

      const index = (Object.keys(runObj)).map(it => Number(it)).sort((a, b) => {
        return a - b
      })

      const min = []
      const avg = []
      const max = []
      for (let i = 0, len = index.length; i < len; i++) {
        const key = index[i]
        let arr = runObj[key]
        min.push(arr[0])
        avg.push(this.getAvg(arr))
        max.push(arr[arr.length - 1])
      }

      // console.log({ index, min, max })

      return {
        index,
        min,
        avg,
        max,
        minNumber: msArr[0] || 0,
        avgNumber: this.getAvg(msArr),
        maxNumber: msArr[msArr.length - 1] || 0
      }
    },
    refreshView () {
      this.responses = this.testMsgs.length

      const {
        index,
        min,
        avg,
        max,
        minNumber,
        avgNumber,
        maxNumber
      } = this.getData()

      this.resMin = minNumber
      this.resAvg = avgNumber
      this.resMax = maxNumber

      this.myChart.setOption({
        dataset: {
          source: {
            index: index.map(it => it + 1),
            min,
            avg,
            max
          }
        }
      })
    }
  }
}
</script>

<style>
#testing {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.setting {
  display: flex;
  margin-bottom: 16px;
}

.runnum-input, .start-btn {
  margin-left: 16px;
}

.main {
  min-height: 400px;
}

.up {
  display: flex;
  margin-top: 16px;
  margin-bottom: 16px;
}

.item {
  min-width: 150px;
  text-align: center;
}

#chart {
  height: 360px;
}
</style>