
<template>
  <div class="footer-wrap">
    <p>{{ topic }}</p>
    <p>版权所有: 凝方科技</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      topic: state => state.topic
    })
  }
}
</script>

<style scoped>
.footer-wrap {
  padding-left: 100px;
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>
