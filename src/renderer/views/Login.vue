
<template>
  <div id="login">
    <div class="login-form">
      <el-input
        class="login-form-item"
        placeholder="User Name"
        v-model="userName">
      </el-input>

      <el-input
        class="login-form-item"
        type="password"
        placeholder="Password"
        v-model="password">
      </el-input>

      <el-input
        class="login-form-item"
        placeholder="Abbreviation"
        v-model="abbreviation">
      </el-input>

      <el-button
        class="login-form-item left"
        type="primary"
        :loading="logining"
        @click="login">login</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import config from '../config/index.js'

export default {
  data() {
    return {
      userName: '',
      password: '',
      abbreviation: ''
    }
  },
  computed: {
    ...mapState({
      logining: state => state.logining
    })
  },
  methods: {
    ...mapActions([
      'setLogining'
    ]),
    login() {
      const userName = this.userName.trim()
      const password = this.password.trim()
      const abbreviation = this.abbreviation.trim()
      if (userName && password && abbreviation) {
        this.setLogining(true)

        const msg = {
          key: 'login',
          req: {
            userName,
            password,
            abbreviation,
            redirect: this.$route.query.redirect
          }
        }
  
        this.$$ipc.send(msg)
      }
    }
  }
}
</script>

<style scoped>
.login-form {
  padding: 16px;
  max-width: 200px;
  display: flex;
  flex-direction: column;
}

.login-form-item {
  margin-top: 16px;
}

.login-form-item.left {
  align-self: flex-end;
}
</style>
