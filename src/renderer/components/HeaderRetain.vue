
<template>
  <div class="header-wrap">
    <div class="btn-back-wrap">
      <el-button
        icon="el-icon-back"
        circle
        @click="goBack"></el-button>
    </div>
    <div class="input-topic">
      <el-input v-model="topic" placeholder="Search Topic"></el-input>
    </div>
    <span class="filter-count">{{fMsgLen}}</span>
    <div class="title">Hardware Retain</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      searchTopic: state => state.searchTopic,
      fMsgLen: state => state.fMsgLen
    }),
    topic: {
      get () {
        return this.searchTopic
      },
      set (value) {
        this.updateSearchTopic(value)
      }
    }
  },
  methods: {
    ...mapActions([
      'updateSearchTopic'
    ]),
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.header-wrap {
  width: 100%;
  display: flex;
  align-items: center;
}
.btn-back-wrap {
  width: 160px;
}
.input-topic {
  max-width: 300px;
}
.filter-count {
  padding-left: 16px;
}
.title {
  flex: auto;
  text-align: right;
}
</style>
