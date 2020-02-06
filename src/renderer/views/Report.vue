<template>
  <div id="report">
    <el-steps :active="active" finish-status="success" simple>
      <el-step title="Step 1"></el-step>
      <el-step title="Step 2"></el-step>
      <el-step title="Step 3"></el-step>
      <el-step title="Step 4"></el-step>
      <el-step title="Step 5"></el-step>
    </el-steps>

    <div id="search-wrap">
      <div id="select-organize-wrap"
        v-show="active === 0">
        <el-select v-model="organize" placeholder="Please select organize">
          <el-option
            v-for="item in organizes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div id="device-point-wrap"
        v-show="active === 1">
        <el-transfer
          :titles="['Source', 'Target']"
          v-model="datasourceNames"
          :data="devicepoints.arr"
        >
          <div slot-scope="{ option }">
            <div :title="option.label">
              <span>{{ option.label.split('\n')[0] }}</span>
              <br>
              <span class="sub-item">{{ option.label.split('\n')[1] }}</span>
              <br>
              <span class="sub-item">{{ option.label.split('\n')[2] }}</span>
            </div>
          </div>
        </el-transfer>
      </div>

      <div id="date-wrap"
        v-show="active === 2">
        <div style="display: none;">
          <el-radio-group v-model="dateType">
            <el-radio-button label="多选日期"></el-radio-button>
            <el-radio-button label="单选日期"></el-radio-button>
            <el-radio-button label="日期范围"></el-radio-button>
          </el-radio-group>
        </div>

        <div class="datelist"
          v-show="dateType === '多选日期'">
          <div class="date-list">
            <div v-for="(item, index) in datelist" :key="index">
              {{ item }}
            </div>
          </div>
          <el-date-picker
            type="dates"
            v-model="datelist"
            placeholder="Select one or more dates"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>

        <div class="datesingle"
          v-show="dateType === '单选日期'">
          <el-date-picker
            v-model="datesingle"
            type="date"
            placeholder="选择一个日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>

        <div class="daterange"
          v-show="dateType === '日期范围'">
          <el-date-picker
            v-model="daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        
      </div>

      <div id="select-tzname-wrap"
        v-show="active === 3">
        <el-select v-model="tzname" placeholder="Please select tzname">
          <el-option
            v-for="item in tznames"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div id="result-wrap"
        v-show="active === 4"
      >
        <el-table
          :data="reportexcels"
          style="width: 100%">
          <el-table-column
            type="index">
          </el-table-column>
          <el-table-column
            prop="time"
            label="Time">
          </el-table-column>
          <el-table-column
            prop="name"
            label="Data source">
          </el-table-column>
          <el-table-column
            prop="dname"
            label="Device name">
          </el-table-column>
          <el-table-column
            prop="pname"
            label="Point name">
          </el-table-column>
          <el-table-column
            prop="original"
            label="Original">
          </el-table-column>
          <el-table-column
            prop="value"
            label="Value">
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div id="step-btn-wrap">
      <el-button size="mini" @click="resetStep">Back to step1</el-button>
      <el-button
        :disabled="reportDisabled"
        type="success"
        size="mini"
        @click="downloadExcel">
        Download to excel
      </el-button>
      <el-button-group>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-arrow-left"
          @click="preStep"
          :disabled="active < 1"
        >上一步</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="nextStep"
          :disabled="active > 3"
        >
          下一步
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      active: 0,
      organize: '',
      datasourceNames: [],
      dateType: '多选日期',
      datelist: [],
      datesingle: '',
      daterange: [],
      tzname: ''
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      organizes: state => state.organizes,
      tznames: state => state.tznames,
      reportexcels: state => state.reportexcels
    }),
    ...mapGetters({
      devicepoints: 'transferDatasourceNames'
    }),
    reportDisabled () {
      return !(this.active === 4 && this.reportexcels.length > 0)
    }
  },
  watch: {
    organize (newVal) {
      if (newVal) {
        // console.log({ newVal })
        // 查找数据源列表
        this.getDatasourcelist(newVal)
        this.getDevicepoint(newVal)
        this.datasourceNames = []
      }
    }
    // datelist (newVal) {
    //   console.log({ newVal })
    // },
    // datesingle (newVal) {
    //   console.log({ newVal })
    // },
    // daterange (newVal) {
    //   console.log({ newVal })
    // }
  },

  beforeMount () {
    // 查找公司列表
    this.getOrganizelist()
    this.getTznamelist()
  },

  methods: {
    resetStep () {
      this.active = 0
    },
    preStep () {
      if (this.active > 0) {
        this.active--
      }
    },
    nextStep () {
      switch (this.active) {
        case 0:
          if (this.organize === '') {
            this.$notify.error({
              title: 'Error',
              message: 'Please select one organize'
            })
            return
          }
          break
        case 1:
          if (this.datasourceNames.length === 0) {
            this.$notify.error({
              title: 'Error',
              message: 'Please select datasources'
            })
            return
          }
          break
        case 2:
          if (this.datelist.length === 0) {
            this.$notify.error({
              title: 'Error',
              message: 'Please select one or more dates'
            })
            return
          }
          break
        case 3:
          if (this.tzname === '') {
            this.$notify.error({
              title: 'Error',
              message: 'Please select one tzname'
            })
            return
          }
          this.getReportlist()
          break
        default:
          break
      }

      if (this.active < 4) {
        this.active++
      }
    },
    getOrganizelist () {
      // 查找公司列表
      const msg = {
        key: 'organizelist',
        req: {
          token: this.user.token
        }
      }
      this.$$ipc.send(msg)
    },
    getTznamelist () {
      const msg = {
        key: 'tznamelist',
        req: {
          token: this.user.token
        }
      }
      this.$$ipc.send(msg)
    },
    getDatasourcelist (db) {
      // 查找数据源列表
      const msg = {
        key: 'datasourcelist',
        req: {
          token: this.user.token,
          db
        }
      }
      // console.log({ msg })
      this.$$ipc.send(msg)
    },

    getDevicepoint (db) {
      // 查找数据源列表
      const msg = {
        key: 'devicepoint',
        req: {
          token: this.user.token,
          db
        }
      }
      this.$$ipc.send(msg)
    },

    getType () {
      return ['多选日期', '单选日期', '日期范围'].indexOf(this.dateType)
    },
    getReportlist () {
      const msg = {
        key: 'reportexcellist',
        req: {
          token: this.user.token,
          db: this.organize,
          names: this.datasourceNames,
          dates: this.datelist,
          tzname: this.tzname,
          type: this.getType()
        }
      }
      console.log(JSON.stringify(msg, null, 2))
      this.$$ipc.send(msg)
    },

    downloadExcel () {
      // console.log(this.reportexcels)
      // 弹出文件夹选框
      this.$$ipc.showSaveDialog({
        type: 1,
        defaultPath: 'Report.xlsx'
      })
    }
  }
}
</script>

<style scoped>
#report {
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

#step-btn-wrap {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
}

#search-wrap {
  flex: auto;
  display: flex;
  justify-content: center;
  padding-top: 16px;
  /* align-items: center; */
}

#date-wrap {
  width: 100%;
}
.datelist {
  position: relative;
  display: flex;
  justify-content: center;
}
.date-list {
  position: absolute;
  left: 0;
}

.sub-item {
  color: #999;
  font-size: 12px;
}

#result-wrap {
  width: 100%;
}
</style>