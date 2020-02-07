
<template>
  <div id="task-list">
    <div class="counts">
      <div>active: {{ jobCounts.active }}</div>
      <div>completed: {{ jobCounts.completed }}</div>
      <div>delayed: {{ jobCounts.delayed }}</div>
    </div>
    <div class="counts">
      <div>failed: {{ jobCounts.failed }}</div>
      <div>paused: {{ jobCounts.paused }}</div>
      <div>waiting: {{ jobCounts.waiting }}</div>
    </div>
    
    <el-table
      border
      :data="delayedJobs">
      <el-table-column
        label="ID">
        <template slot-scope="scope">
          <div>{{ scope.row.name }}</div>
          <div>{{ scope.row.opts.repeat.cron }}</div>
        </template>
      </el-table-column>

      <el-table-column
        label="cron"
        width="320">
        <template slot-scope="scope">
          <el-select
            disabled
            :value="scope.row.opts.repeat.cron"
            style="width: 300px;">
            <el-option
              v-for="item in cronOption"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column
        label="prevMillis">
        <template slot-scope="scope">
          <div>{{ $$moment(scope.row.opts.prevMillis).format('YYYY-MM-DD HH:mm') }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      organize: ''
    }
  },
  // {
  //   "attemptsMade": 0,
  //   "data": {
  //     "configId": "5e3d7c616dffb200114753ee",
  //     "dbName": "5caee23e86f2de2914809bf6"
  //   },
  //   "delay": 1987504786,
  //   "finishedOn": null,
  //   "id": "repeat:4d5341e93f68f502545e6b0026721a3f:1583085600000",
  //   "name": "5e3d7c616dffb200114753ee",
  //   "opts": {
  //     "attempts": 1,
  //     "delay": 1987504786,
  //     "jobId": "repeat:4d5341e93f68f502545e6b0026721a3f:1583085600000",
  //     "prevMillis": 1583085600000,
  //     "removeOnComplete": true,
  //     "removeOnFail": true,
  //     "repeat": {
  //       "count": 1,
  //       "cron": "0 18 1 * *"
  //     },
  //     "timestamp": 1581098095214
  //   },
  //   "processedOn": null,
  //   "progress": 0,
  //   "returnvalue": null,
  //   "stacktrace": [],
  //   "timestamp": 1581098095214
  // }
  computed: {
    ...mapState({
      // organizes: state => state.organizes,
      jobCounts: state => state.jobCounts,
      delayedJobs: state => state.delayedJobs
    }),
    ...mapGetters({
      cronOption: 'getCronOption'
    })
  },

  mounted () {
    this.organize = this.$route.params.organize
  }
}
</script>

<style scoped>
#task-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.counts {
  display: flex;
}

.counts > div {
  flex: 1;
  padding-bottom: 8px;
}
</style>
