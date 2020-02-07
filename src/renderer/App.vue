
<template>
  <el-container id="app">
    <el-header>
      <component :is="headerComponent"></component>
    </el-header>

    <el-container style="overflow: hidden;">
      <!-- <el-aside>
        <el-menu :router="true"
          default-active="/">
          <el-menu-item index="/">
            <i class="el-icon-location"></i>
            <span slot="title">Home</span>
          </el-menu-item>
          <el-menu-item index="/retain">
            <i class="el-icon-menu"></i>
            <span slot="title">Retain</span>
          </el-menu-item>
          <el-menu-item index="#">
            <i class="el-icon-document"></i>
            <span slot="title">Todo</span>
          </el-menu-item>
          <el-menu-item index="#">
            <i class="el-icon-setting"></i>
            <span slot="title">Todo</span>
          </el-menu-item>
        </el-menu>
      </el-aside> -->
      
      <el-main class="page-component__scroll">
        <router-view class="el-scrollbar__wrap"></router-view>
      </el-main>
    </el-container>

    <el-footer>
      <component :is="footerComponent"></component>
    </el-footer>
  </el-container>
</template>

<script>
import HeaderLogin from './components/HeaderLogin.vue'
import HeaderHome from './components/HeaderHome.vue'
import HeaderRetain from './components/HeaderRetain.vue'
import HeaderTesting from './components/HeaderTesting.vue'
import HeaderGithub from './components/HeaderGithub.vue'
import HeaderReport from './components/HeaderReport.vue'
import HeaderImportList from './components/HeaderImportList.vue'
import HeaderImport from './components/HeaderImport.vue'
import HeaderTaskList from './components/HeaderTaskList.vue'

import FooterLogin from './components/FooterLogin.vue'
import FooterHome from './components/FooterHome.vue'
import FooterRetain from './components/FooterRetain.vue'
import FooterTesting from './components/FooterTesting.vue'
import FooterGithub from './components/FooterGithub.vue'
import FooterReport from './components/FooterReport.vue'
import FooterImportList from './components/FooterImportList.vue'
import FooterImport from './components/FooterImport.vue'
import FooterTaskList from './components/FooterTaskList.vue'

export default {
  components: {
    'header-login': HeaderLogin,
    'header-home': HeaderHome,
    'header-retain': HeaderRetain,
    'header-testing': HeaderTesting,
    'header-github': HeaderGithub,
    'header-report': HeaderReport,
    'header-importList': HeaderImportList,
    'header-import': HeaderImport,
    'header-tasklist': HeaderTaskList,

    'footer-login': FooterLogin,
    'footer-home': FooterHome,
    'footer-retain': FooterRetain,
    'footer-testing': FooterTesting,
    'footer-github': FooterGithub,
    'footer-report': FooterReport,
    'footer-importList': FooterImportList,
    'footer-import': FooterImport,
    'footer-tasklist': FooterTaskList
  },
  computed: {
    headerComponent () {
      const name = this.$route.name || 'login'
      // console.log({ name })
      return `header-${name}`
    },
    footerComponent () {
      const name = this.$route.name || 'login'
      // console.log({ name })
      return `footer-${name}`
    }
  }
}
</script>

<style>
.el-header, .el-footer {
  display: flex;
  align-items: center;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
}
.el-aside {
  width: unset !important;
}
.el-menu {
  background: transparent;
  height: 100%;
}
.el-main {
  padding: 0;
}
</style>
