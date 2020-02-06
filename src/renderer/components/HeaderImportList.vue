
<template>
  <div class="header-wrap">
    <div class="btn-back-wrap">
      <el-button
        icon="el-icon-back"
        circle
        @click="goBack"></el-button>
    </div>

    <div class="title">Database Import List</div>
  </div>
</template>

<script>
export default {
  methods: {
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

.title {
  flex: auto;
  text-align: right;
}
</style>
