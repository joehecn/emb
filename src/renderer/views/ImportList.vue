<template>
  <div id="import-list">
    <div class="btns">
      <el-button
        class="start-btn"
        :disabled="organize === ''"
        @click="goTasks">View Tasks</el-button>

      <el-select
        :value="organize"
        @input="value => organizeChange(value)"
        placeholder="Please select organize"
        style="width: 260px;">
        <el-option
          v-for="item in organizes"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-button
        class="start-btn"
        type="success"
        :disabled="organize === ''"
        @click="goImport('add')">Add New</el-button>
    </div>

    <div class="table-wrap"
      v-show="organize !== ''">
      <el-table
        border
        :data="dbConfigList">
        <el-table-column
          prop="name"
          label="name">
        </el-table-column>

        <el-table-column
          prop="type"
          label="type">
        </el-table-column>

        <el-table-column
          prop="database"
          label="database">
        </el-table-column>

        <el-table-column
          label="cron"
          width="320">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.cron"
              :disabled="true"
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
          fixed="right"
          label="operate"
          width="160">
          <template slot-scope="scope">
            <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
            <el-button @click="goImport(scope.row._id)" type="success" size="small">编辑</el-button>
            <el-button @click="remove(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {}
  },

  computed: {
    ...mapState({
      user: state => state.user,
      organize: state => state.organize,
      organizes: state => state.organizes,
      dbConfigList: state => state.dbConfigList
    }),
    ...mapGetters({
      cronOption: 'getCronOption'
    })
  },

  mounted () {
    // 查找公司列表
    if (!this.organize) {
      this.getOrganizelist()
    } else {
      this.getDbConfigList(this.organize)
    }
  },

  methods: {
    ...mapActions([
      'setOrganize',
      'removeDbConfigListItem'
    ]),

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

    getDbConfigList (db) {
      const msg = {
        key: 'dbConfigList',
        req: {
          token: this.user.token,
          db
        }
      }
      this.$$ipc.send(msg)
    },

    organizeChange (value) {
      this.setOrganize(value)
      this.getDbConfigList(value)
    },

    goImport (id) {
      this.$router.push(`/import/${this.organize}/${id}`)
    },

    remove ({ _id, name, cron }) {
      this.$confirm(`<span>Remove ${name}?</span><br><strong style="color: #E6A23C;"><i>高危操作!!!</i></strong>`, 'Noties', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: 'YES',
        cancelButtonText: 'NO',
        type: 'warning'
      }).then(async () => {
        const arg = { _id, cron }
        // console.log(arg)
        const msg = {
          key: 'dbConfigRemove',
          req: {
            token: this.user.token,
            db: this.organize,
            arg
            // arg : { _id: '5e3d7c616dffb200114753ee', cron: '0 18 1 * *' }
          }
        }

        const res = await this.$$ipc.sendPromise(msg)
        // console.log({ res })

        if (res.body.code === 0) {
          // 删除 res.body.data._id
          this.removeDbConfigListItem(res.body.data._id)
        } else {
          this.$notify.error({
            title: 'Error',
            message: `${res.body.code} - ${res.body.message}`
          })
          return
        }
      }).catch(() => {})
    },

    goTasks () {
      this.$router.push(`/tasklist/${this.organize}`)
    }
  }
}
</script>

<style scoped>
#import-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: space-between;
}

.table-wrap {
  margin-top: 16px;
}
</style>