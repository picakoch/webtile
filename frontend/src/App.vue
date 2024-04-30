<template>
  <div v-if="$apollo.loading" class="uk-position-center">
    <div class="spinner uk-margin-top" uk-spinner="ratio: 3"></div>
  </div>
  <template v-else>
    <NavBar/>
    <router-view :key="$route.fullPath"></router-view>
    <div class="uk-width-1-1 uk-margin-top uk-padding-left">
      Design and dev: <a href="https://www.n21.fr">N21</a>
    </div>
  </template>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import {CONFIG_Q} from "@/lib/queries";

export default {
  name: 'App',
  components: {
    NavBar
  },
  data() {
    return {
      config: null,
    };
  },
  mounted() {
  },
  apollo: {
    config: {
      query: CONFIG_Q,
      fetchPolicy: 'cache-first',
      result(res){
        this.$log.debug(res)
        this.$store.commit('setConfig', res.data.config.data.attributes)
        this.$log.debug(this.$store.getters.config)
      }
    },
  },
}
</script>


<style lang="less">
#app {
  font-family: Raleway, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@import "../node_modules/uikit/src/less/uikit.less";

.spinner {
  color: white;
  margin-left: auto;
}

.uk-spinner svg * {
  stroke-width: 2px !important;
}
</style>
