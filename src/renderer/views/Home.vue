


<template>
  <div id="home">
    <p>{{ user.name }} - {{ user.isSuper ? 'super' : 'user' }}</p>
    <h1 class="title">{{ name }}</h1>

    <el-row :gutter="12">
      <el-col
        v-if="user.isSuper"
        :span="12">
        <div class="card-wrap">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>Report</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="goto('report')">
                see more...
              </el-button>
            </div>
            Excel Report
          </el-card>
        </div>
      </el-col>

      <el-col
        v-if="user.isSuper"
        :span="12">
        <div class="card-wrap">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>Hardware</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="goto('hardware')">
                see more...
              </el-button>
            </div>
            Hardware Retain Message
          </el-card>
        </div>
      </el-col>

      <el-col
        v-if="user.isSuper"
        :span="12">
        <div class="card-wrap">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>App</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="goto('app')">
                see more...
              </el-button>
            </div>
            App Retain Message
          </el-card>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="card-wrap">
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>Testing</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="goto('testing')">
                see more...
              </el-button>
            </div>
            Performance Testing
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      name: 'Bigproject Monitor'
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    goto(where) {
      if (where === 'testing' || where === 'report') {
        this.$router.push(`/${where}`)
      } else {
        this.$router.push(`/retain/${where}`)
      }
    }
  }
}
</script>

<style scoped>
#home {
  padding: 16px;
}
.title {
  text-align: center;
  padding: 16px;
}
.card-wrap {
  padding-top: 12px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>