
<template>
  <div id="import">
    <el-steps :active="active" finish-status="success" simple>
      <el-step title="Step 1"></el-step>
      <el-step title="Step 2"></el-step>
      <el-step title="Step 3"></el-step>
      <el-step title="Step 4"></el-step>
      <el-step title="Step 5"></el-step>
    </el-steps>

    <div id="search-wrap">
      <div id="nomal-wrap"
        v-show="active === 0">
        <el-form :model="nomalForm" :rules="nomalRules" ref="nomalForm" label-width="150px" class="demo-nomalForm">
          <el-form-item label="organize" prop="organize">
            <el-select v-model="nomalForm.organize" :disabled="true">
              <el-option
                v-for="item in organizes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Config name" prop="name">
            <el-input v-model="nomalForm.name" placeholder="please input name"></el-input>
          </el-form-item>

          <el-form-item label="cron" prop="cron">
            <el-select v-model="nomalForm.cron" placeholder="please select cron">
              <el-option
                v-for="item in cronOption"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="interval" prop="interval">
            <el-select v-model="nomalForm.interval" placeholder="please select interval">
              <el-option
                v-for="item in intervalOption"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="strict">
            <el-switch v-model="nomalForm.strict"></el-switch>
          </el-form-item> -->
        </el-form>
      </div>

      <div id="db-connect-wrap"
        v-show="active === 1">
        <el-form :model="connForm" :rules="connRules" ref="connForm" label-width="100px" class="demo-connForm">
          <el-form-item label="db type" prop="type">
            <el-select v-model="connForm.type" placeholder="please select db type">
              <el-option label="Mysql" value="mysql"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="host" prop="host">
            <el-input v-model="connForm.host" placeholder="please input host"></el-input>
          </el-form-item>

          <el-form-item label="port" prop="port">
            <el-input v-model="connForm.port" placeholder="please input port"></el-input>
          </el-form-item>

          <el-form-item label="user" prop="user">
            <el-input v-model="connForm.user" placeholder="please input user"></el-input>
          </el-form-item>

          <el-form-item label="password" prop="password">
            <el-input v-model="connForm.password" placeholder="please input password"></el-input>
          </el-form-item>

          <el-form-item label="database" prop="database">
            <el-input v-model="connForm.database" placeholder="please input database"></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button @click="submitForm('connForm')">Testing Connection ...</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div id="tables-wrap"
        v-show="active === 2">
        <el-select v-model="selectTables" multiple placeholder="please select tables">
          <el-option
            v-for="item in tables"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>

      <div id="headers-wrap"
        v-show="active === 3">
        <!-- @tab-click="handleTableNameClick" -->
        <el-tabs v-model="activeTableName">
          <el-tab-pane
            v-for="(tableType, index) in tableTypes"
            :key="tableType.table"
            :label="tableType.table" :name="tableType.table">

              <el-radio-group v-model="tableType.type" disabled size="mini">
                <el-radio-button label="column"></el-radio-button>
                <el-radio-button label="row"></el-radio-button>
              </el-radio-group>

              <el-table
                border
                size="mini"
                :data="resTables[index]">
                <el-table-column
                  v-for="(head, index) in resHeaderNames[index]"
                  :key="head"
                  :fixed="index === 0 ? true : false"
                  :prop="head"
                  :label="head">
                </el-table-column>
              </el-table>

              <div style="height: 32px;"></div>

              <el-table
                border
                :data="headers[index]">
                <el-table-column
                  prop="inField"
                  label="inField">
                </el-table-column>

                <el-table-column
                  prop="inType"
                  label="inType"
                  width="180">
                </el-table-column>

                <el-table-column
                  label="outField">
                  <template slot-scope="scope">
                    <el-input :value="scope.row.outField" @input="value => updateFiled(tableType.table, scope.row.inField, value, index, scope.$index, 'outField')"></el-input>
                  </template>
                </el-table-column>
                
                <el-table-column
                  label="outType">
                  <template slot-scope="scope">
                    <el-select
                      :value="scope.row.outType"
                      placeholder="select outType"
                      @visible-change="value => outTypeVisibleChange(value, index)"
                      @input="value => updateFiled(tableType.table, scope.row.inField, value, index, scope.$index, 'outType')">
                      <el-option
                        v-for="item in outTypeOption"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column
                  label="unit">
                  <template slot-scope="scope">
                    <el-input :value="scope.row.unit" @input="value => updateFiled(tableType.table, scope.row.inField, value, index, scope.$index, 'unit')"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
        </el-tabs>
      </div>

      <div id="result-wrap"
        v-show="active === 4">
        <el-table
          border
          :data="importlist">
          <el-table-column
            prop="table"
            label="table">
          </el-table-column>
          <el-table-column
            prop="inField"
            label="inField">
          </el-table-column>
          <el-table-column
            prop="time"
            label="time">
          </el-table-column>
          <el-table-column
            prop="name"
            label="name">
          </el-table-column>
          <el-table-column
            prop="value"
            label="value">
          </el-table-column>
          <el-table-column
            prop="unit"
            label="unit">
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div id="step-btn-wrap">
      <el-button size="mini" @click="resetStep">Back to step1</el-button>
      <el-button
        :disabled="!(active === 4 && importlist.length > 0)"
        type="success"
        size="mini"
        :loading="saveIsLoading"
        @click="saveToDb">
        Save config
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
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      active: 0,
      cronOption: [
        { key: '0 2 1 * *', value: 'At 02:00 AM, on day 1 of the month' },
        { key: '0 2 */15 * *', value: 'At 02:00 AM, every 15 days' },
        { key: '0 2 */10 * *', value: 'At 02:00 AM, every 10 days' },
        { key: '0 2 */5 * *', value: 'At 02:00 AM, every 5 days' },
        { key: '0 2 * * *', value: 'At 02:00 AM' }
      ],
      // intervalOption: [
      //   { key: 60, value: '1 Hour' },
      //   { key: 30, value: '30 Minutes' },
      //   { key: 15, value: '15 Minutes' },
      //   { key: 10, value: '10 Minutes' },
      //   { key: 5, value: '5 Minutes' }
      // ],
      nomalRules: {
        name: [
          { required: true, message: 'please input name', trigger: 'blur' }
        ],
        organize: [
          { required: true, message: 'please input organize', trigger: 'change' }
        ]
      },
      connRules: {
        type: [
          { required: true, message: 'please select db type', trigger: 'change' }
        ],
        host: [
          { required: true, message: 'please input host', trigger: 'blur' }
        ],
        port: [
          { required: true, message: 'please input port', trigger: 'blur' }
        ],
        user: [
          { required: true, message: 'please input user', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'please input password', trigger: 'blur' }
        ],
        database: [
          { required: true, message: 'please input database', trigger: 'blur' }
        ]
      },
      // 是否运行定时任务
      isRun: false,
      // 表单格式
      layout: 'row', // 'row' | 'column'
      nomalForm: {
        organize: '',
        name: '',
        cron: ''
        // interval: 60, // Minutes
        // strict: false // 是否严格匹配时间模式
      },
      connForm: {
        type: '', // mysql
        host: '', // localhost
        port: '', // 3306
        user: '', // root
        password: '', // haeco
        database: '' // haeco
      },
      tables: [],
      selectTables: [],
      tableTypes: [
        // {
        //   table: '',
        //   type: 'column' | 'row'
        // }
      ],
      activeTableName: '',
      outTypeOption: [
        {
          value: '',
          label: '', // '<not choose>',
          disabled: false
        },
        {
          value: 'time',
          label: 'time',
          disabled: false
        },
        {
          value: 'name',
          label: 'name',
          disabled: false
        }
      ],
      importlist: [
        // {
        //   table
        //   inField,
        //   time,
        //   name,
        //   value,
        //   unit
        // }
      ],
      markObj: {
        // table: {
        //   inField: {
        //     outField,
        //     outType,
        //     unit
        //   }
        // }
      },
      saveIsLoading: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      organizes: state => state.organizes,
      // tables: state => state.tables,
      headers: state => state.headers,
      resTables: state => state.resTables,
      resHeaderNames: state => state.resHeaderNames,
      dbConfigList: state => state.dbConfigList
    })
  },

  // watch: {
  //   tables (newVal) {
  //     console.log({ newVal })
  //     const intersect = this.selectTables.filter(item => newVal.includes(item))
  //     console.log({ intersect })
  //     this.selectTables = intersect
  //   }
  // },

  // beforeMount () {
  //   // 查找公司列表
  //   this.getOrganizelist()
  // },

  mounted () {
    const id = this.$route.params.id
    const config = this.initConfig(id)
    console.log({ id, config })
    const organize = this.$route.params.organize
    this.initDataFromConfig(config, organize)
  },

  methods: {
    ...mapActions([
      'initHeaders',
      'updateHeaders'
    ]),

    initConfig (id) {
      const config = {
        // Step 1
        name: '',
        cron: '0 2 1 * *',
        // Step 2
        type: 'mysql',
        host: '',
        port: '',
        user: '',
        password: '',
        database: '',
        // Step 3 选 tables->name
        tables: [
          // {
          //   // 对客户端隐藏
          //   // 新增时添加下面这个默认值
          //   // 运行定时任务时修改这个值
          //   // where: JSON.stringify([
          //   //   {
          //   //     name: 'Time',
          //   //     schemaName: 'time',
          //   //     value: new Date('2000-01-01T00:00:00.000Z'),
          //   //     operator: '>'
          //   //   }
          //   // ]),
          //   // 为未来预留字段
          //   type: 'column', // 'row'
          //   name: 'p4_meter_1',
          //   // Step 4
          //   fields: [
          //     {
          //       // inField
          //       name: 'Time',
          //       inType: 'timestamp',
          //       // outField
          //       standard: 'Time', // 逻辑中不起作用
          //       // outType
          //       schemaName: 'time',
          //       unit: '', // 逻辑中不起作用
          //       computeProcess: true // 逻辑中不起作用
          //     },
          //     {
          //       // inField
          //       name: 'p4_pm181_kwh',
          //       inType: 'float',
          //       // outField
          //       standard: 'p4_pm181_kwh',
          //       // outType
          //       schemaName: 'name',
          //       unit: 'kWh',
          //       computeProcess: true
          //     },
          //     {
          //       // inField
          //       name: 'p4_pm181_kw',
          //       inType: 'float',
          //       // outField
          //       standard: 'p4_pm181_kw',
          //       // outType
          //       schemaName: 'name',
          //       unit: 'kW',
          //       computeProcess: true
          //     },
          //     {
          //       // inField
          //       name: 'p4_pm181_kva',
          //       inType: 'float',
          //       // outField
          //       standard: 'p4_pm181_kva',
          //       // outType
          //       schemaName: 'name',
          //       unit: 'kVa',
          //       computeProcess: true
          //     }
          //   ]
          // }
        ]
      }
      if (id !== 'add') {
        for (let i = 0, len = this.dbConfigList.length; i < len; i++) {
          const item = this.dbConfigList[i]
          console.log(item)
          if (id === item._id) return item
        }
      }
      return config
    },

    initDataFromConfig (config, organize) {
      // Step 1
      this.nomalForm.organize = organize

      this.nomalForm.name = config.name
      this.nomalForm.cron = config.cron
      // step 2
      this.connForm.type = config.type
      this.connForm.host = config.host
      this.connForm.port = config.port
      this.connForm.user = config.user
      this.connForm.password = config.password
      this.connForm.database = config.database
      // step 3
      const { tables } = config
      this.selectTables = tables.map(({ name }) => name)
      // step 4 markObj
      this.initMarkObj(tables)
    },

    resetStep () {
      this.active = 0
    },

    preStep () {
      if (this.active > 0) {
        this.active--
      }
    },

    notifyDatabaseConfigError () {
      this.$notify.error({
        title: 'Error',
        message: 'Please check the database config'
      })
    },

    initSelectTables (tables) {
      console.log({ tables })
      this.tables = tables
      const intersect = this.selectTables.filter(item => tables.includes(item))
      console.log({ intersect })
      this.selectTables = intersect
    },
    async nextStep () {
      switch (this.active) {
        case 0:
          if (!this.validateForm('nomalForm')) {
            this.$notify.error({
              title: 'Error',
              message: 'Please check the nomal config'
            })
            return
          }
          // console.log(this.nomalForm)
          break
        case 1: {
          if (!this.validateForm('connForm')) {
            this.notifyDatabaseConfigError()
            return
          }

          const { isOk, tables } = await this.getTablelist()
          if (!isOk) return

          this.initSelectTables(tables)
          break
        }
        case 2: {
          const len = this.selectTables.length
          if (len === 0) {
            this.$notify.error({
              title: 'Error',
              message: 'Please select tables'
            })
            return
          }

          this.initTableTypes()
          this.initHeaders(len)
          this.getAllHeaders(len)

          const table = this.selectTables[0]
          this.activeTableName = table
          break
        }
        case 3:
          this.getImportlist()
          break
        default:
          break
      }

      if (this.active < 4) {
        this.active++
      }
    },

    // getOrganizelist () {
    //   // 查找公司列表
    //   const msg = {
    //     key: 'organizelist',
    //     req: {
    //       token: this.user.token
    //     }
    //   }
    //   this.$$ipc.send(msg)
    // },

    validateForm(formName) {
      let isValid = false
      this.$refs[formName].validate(valid => {
        if (valid) {
          isValid = true
        } else {
          return false
        }
      })
      return isValid
    },
    async submitForm(formName) {
      const isValid = this.validateForm(formName)
      if (!isValid) {
        this.notifyDatabaseConfigError()
        return
      }

      // 测试连接是否成功
      const { isOk } = await this.getTablelist()
      if (isOk) {
        this.$notify.success({
          title: 'Success',
          message: 'Connected ok'
        })
      }
    },

    async getTablelist () {
      // 查找数据表
      const msg = {
        key: 'tablelist',
        req: {
          token: this.user.token,
          connForm: this.connForm
        }
      }
      const res = await this.$$ipc.sendPromise(msg)

      if (res.body.code === 0) {
          // 成功
        return { isOk: true, tables: res.body.data }
      }

      this.notifyDatabaseConfigError()
      return { isOk: false }
    },

    initTableTypes () {
      const tableTypes = this.selectTables.map(table => {
        return {
          table,
          type: 'column'
        }
      })
      this.tableTypes = tableTypes
    },

    getAllHeaders (len) {
      for (let i = 0; i < len; i++) {
        const table = this.selectTables[i]
        const mark = this.markObj[table] || {}

        this.getHeaderlist(table, i, mark)
      }
    },
 
    getHeaderlist (table, index, mark) {
      // 查找表头
      const msg = {
        key: 'headerlist',
        req: {
          token: this.user.token,
          connForm: this.connForm,
          table,
          index,
          mark
        }
      }
      this.$$ipc.send(msg)
    },

    outTypeVisibleChange (value, index) {
      // console.log({ value, index })
      // 每次展开下拉菜单时
      // 判断是否需要 disabled time 选项
      if (value) {
        const curHeaders = this.headers[index]
        for (let i = 0, len = curHeaders.length; i < len; i++) {
          const { outType } = curHeaders[i]
          if (outType === 'time') {
            this.outTypeOption.splice(1, 1, {
              value: 'time',
              label: 'time',
              disabled: true
            })
            return
          }
        }

        this.outTypeOption.splice(1, 1, {
          value: 'time',
          label: 'time',
          disabled: false
        })
      }
    },

    initMarkObjFromTable (table, fields) {
      for (let i = 0, len = fields.length; i < len; i++) {
        const {
          name: inField,
          standard: outField,
          schemaName: outType,
          unit
        } = fields[i]

        this.insertToMarkObj(table, inField, 'outField', outField)
        this.insertToMarkObj(table, inField, 'outType', outType)
        this.insertToMarkObj(table, inField, 'unit', unit)
      }
    },
    initMarkObj (tables) {
      for (let i = 0, len = tables.length; i < len; i++) {
        const { name: table, fields } = tables[i]
        this.initMarkObjFromTable(table, fields)
      }
    },
    insertToMarkObj (table, inField, field, value) {
      if (!this.markObj[table]) this.markObj[table] = {}
      if (!this.markObj[table][inField]) this.markObj[table][inField] = {}
      this.markObj[table][inField][field] = value
      // console.log(this.markObj)
    },
    updateFiled (table, inField, value, index, rowIndex, field) {
      // console.log({ table, inField, value, index, rowIndex, field })
      this.updateHeaders({ value, index, rowIndex, field })
      this.insertToMarkObj(table, inField, field, value)
    },

    getImportItem (index) {
      const importItem = []
      const filterItem = []
      const headerItem = this.headers[index]
      let timeInField = ''
      for (let i = 0, len = headerItem.length; i < len; i++) {
        const { inField, outField, outType, unit } = headerItem[i]
        if (outType) {
          if (outType === 'time') {
            timeInField = inField
          } else {
            filterItem.push({
              inField,
              outField,
              outType,
              unit
            })
          }
        }
      }

      if (timeInField) {
        const table = this.selectTables[index]
        if (!table) return []

        const resTable = this.resTables[index]
        if (resTable.length > 0) {
          const item = resTable[0]
          for (let i = 0, len = filterItem.length; i < len; i++) {
            const { inField, outField, outType, unit } = filterItem[i]
            importItem.push({
              table,
              inField,
              time: item[timeInField],
              name: outField,
              value: item[inField],
              unit
            })
          }
        }
      }

      return importItem
    },

    getImportlist () {
      const importArr = []
      for (let i = 0, len = this.headers.length; i < len; i++) {
        const importItem = this.getImportItem(i)
        importArr.push(...importItem)
      }
      // console.log(importArr)
      this.importlist = importArr
    },

    getFields (index) {
      const headerItem = this.headers[index]
      const filterItem = []

      let timeInField = null
      for (let i = 0, len = headerItem.length; i < len; i++) {
        const {
          inField: name,
          inType,
          outField: standard,
          outType: schemaName,
          unit
        } = headerItem[i]

        if (schemaName) {
          if (schemaName === 'time') {
            timeInField = {
              name, inType, standard, schemaName, unit, computeProcess: true
            }
          } else {
            filterItem.push({
              name,
              inType,
              standard,
              schemaName,
              unit,
              computeProcess: true
            })
          }
        }
      }

      if (timeInField && filterItem.length > 0) {
        filterItem.unshift(timeInField)
        return filterItem
      }

      return []
    },
    async saveToDb () {
      const db = this.nomalForm.organize

      const config = {}
      // Step 1
      config.name = this.nomalForm.name
      config.cron = this.nomalForm.cron
      // step 2
      config.type = this.connForm.type
      config.host = this.connForm.host
      config.port = this.connForm.port
      config.user = this.connForm.user
      config.password = this.connForm.password
      config.database = this.connForm.database

      const tables = []
      for (let i = 0, len = this.tableTypes.length; i < len; i++) {
        const { table: name, type } = this.tableTypes[i]
        const fields = this.getFields(i)
        if (fields.length > 0) {
          tables.push({
            type,
            name,
            fields
          })
        }
      }

      if (tables.length > 0) {
        this.saveIsLoading = true

        let res = null
        config.tables = tables

        const id = this.$route.params.id
        if (id === 'add') {
          res = await this.postDbConfigAdd(db, config)
        } else {
          config._id = id
          res = await this.postDbConfigUpdate(db, config)
        }

        this.saveIsLoading = false

        if (res.body.code === 0) {
          // 成功, 重定向
          this.$router.go(-1)
        } else {
          this.$notify.error({
            title: 'Error',
            message: `${res.body.code} - ${res.body.message}`
          })
        }
      }
    },

    async postDbConfigAdd (db, arg) {
      const msg = {
        key: 'dbConfigAdd',
        req: {
          token: this.user.token,
          db,
          arg
        }
      }
      const res = await this.$$ipc.sendPromise(msg)
      return res
    },

    async postDbConfigUpdate (db, arg) {
      const msg = {
        key: 'dbConfigUpdate',
        req: {
          token: this.user.token,
          db,
          arg
        }
      }
      const res = await this.$$ipc.sendPromise(msg)
      return res
    }
  }
}
</script>

<style scoped>
#import {
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

#headers-wrap, #result-wrap {
  width: 100%;
}
</style>
