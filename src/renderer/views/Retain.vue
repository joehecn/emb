
<template>
  <div id="retain">
    <div class="infinite-list-wrapper">
      <div
        class="list"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled">
        <div
          v-for="item in hRetainMsgFilter"
          :key="item.topic"
          class="list-item">
          <div class="topic"><p>{{ item.topic }}</p></div>
          <div class="payload">{{ item.payload }}</div>
          <div>
            <el-button
              type="danger"
              :loading="item.removeing"
              @click.native.prevent="deleteRow(item.topic)">
              remove
            </el-button>
          </div>
        </div>
      </div>
      <p class="list-info" v-if="loading">loading...</p>
      <p class="list-info" v-if="noMore">no more</p>
    </div>

    <el-backtop
      style="right: 120px;"
      target=".page-component__scroll .el-scrollbar__wrap">
    </el-backtop>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      hRetainMsgFilter: [],
      loading: false,
      step: 20,
      len: 0
    }
  },
  computed: {
    ...mapState({
      retainMsgs: state => state.retainMsgs,
      // rMsgLen: state => state.retainMsgs.length,
      fMsgLen: state => state.fMsgLen,
      filterRMsgLen: state => state.filterRMsgLen,
      searchTopic: state => state.searchTopic
    }),
    fRetainMsgs () {
      const topic = this.searchTopic.trim()

      let _fRetainMsgs = []
      if (topic === '') {
          _fRetainMsgs = this.retainMsgs
      } else {
        _fRetainMsgs = this.retainMsgs.filter(item => {
          return item.topic.toLowerCase().includes(topic.toLowerCase())
        })
      }

      this.setFMsgLen(_fRetainMsgs.length)
      return _fRetainMsgs
    },
    noMore () {
      return this.hRetainMsgFilter.length >= this.fRetainMsgs.length
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  watch: {
    fMsgLen () {
      this.refresh()
    }
  },
  mounted() {
    // console.log('------ retain mounted')
    // 创建 mqtt 客户端
    const where = this.$route.params.where
    const msg = {
      key: 'createRetainClient',
      req: { where }
    }

    this.$$ipc.send(msg)
  },
  beforeDestroy() {
    this.emptyRetainMsgs()
    // console.log('------ retain beforeDestroy')
    // 销毁 mqtt 客户端
    const msg = {
      key: 'removeRetainClient',
      req: {}
    }

    this.$$ipc.send(msg)
  },
  methods: {
    ...mapActions([
      'emptyRetainMsgs',
      'setFMsgLen',
      'setFilterRMsgLen'
    ]),
    refresh() {
      this.hRetainMsgFilter = this.fRetainMsgs.slice(0, this.len)
      this.setFilterRMsgLen(this.hRetainMsgFilter.length)
    },
    load () {
      this.loading = true
      setTimeout(() => {
        this.len = this.hRetainMsgFilter.length + this.step
        this.refresh()
        this.loading = false
      }, 1000)
    },
    deleteRow(topic) {
      this.$confirm(`<span>Remove ${topic}?</span><br><strong style="color: #E6A23C;"><i>高危操作!!!</i></strong>`, 'Noties', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: 'YES',
        cancelButtonText: 'NO',
        type: 'warning'
      }).then(() => {
        const msg = {
          key: 'removeRetainMsg',
          req: { topic }
        }
        this.$$ipc.send(msg)
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.list {
  border-top: 1px solid #eee;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #eee;
}
.list-item .topic {
  width: 300px;
  flex: none;
}
.list-item .topic p {
  word-wrap: break-word;
  padding-right: 16px;
}
.list-item .payload {
  flex: auto;
  padding-right: 16px;
  overflow: hidden;
  word-wrap: break-word;
}
.list-info {
  text-align: center;
  padding: 16px;
}
</style>
