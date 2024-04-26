<template>
    <NavBar />
    <router-view :key="$route.fullPath"></router-view>
</template>

<script>
import NavBar from "./components/NavBar.vue";
export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>


<style lang="less">
#app {
  font-family: Raleway, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
@import "../node_modules/uikit/src/less/uikit.less";
</style>
