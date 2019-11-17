
<template>
  <div class="footer-wrap">
    <p>{{ filterRMsgLen }} / {{ rMsgLen }}</p>
    <p>版权所有: 凝方科技</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      rMsgLen: state => state.retainMsgs.length,
      filterRMsgLen: state => state.filterRMsgLen
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
