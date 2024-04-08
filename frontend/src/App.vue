<template>
    <Nav />
    <router-view :key="$route.fullPath"></router-view>
</template>

<script>
import Nav from "./components/Nav.vue";

export default {
  name: 'App',
  components: {
    Nav
  }
}
</script>

<style>
#app {
  font-family: Raleway, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
