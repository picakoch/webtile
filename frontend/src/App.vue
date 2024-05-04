<template>
  <div v-if="$apollo.loading" class="uk-position-center">
    <div class="spinner uk-margin-top" uk-spinner="ratio: 3"></div>
  </div>
  <template v-else>
    <NavBar :sub_categories="sub_categories"/>
    <div uk-alert style="border: 8px #F4F1BB solid" class="uk-margin-top headline uk-background-secondary"
         v-if="$store.getters.config?.headline">
      <a href class="uk-alert-close" uk-close></a>
      <StrapiBlocks :content="$store.getters.config.headline"></StrapiBlocks>
    </div>
    <router-view @nav="onNav"></router-view>
    <hr class="uk-divider-icon">

    <div class="uk-width-1-1 uk-margin-top footer uk-text-center">
      <div v-if="$store.getters.config?.contacts">
        <StrapiBlocks :content="$store.getters.config.contacts"></StrapiBlocks>
      </div>
      <div class="uk-text-muted">
        Design and dev: <a href="https://www.n21.fr">N21</a>
      </div>

    </div>
  </template>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import {CONFIG_Q, TAGS_Q} from "@/lib/queries";
import {StrapiBlocks} from 'vue-strapi-blocks-renderer';

export default {
  name: 'App',
  components: {
    NavBar, StrapiBlocks
  },
  data() {
    return {
      config: null,
      sub_categories: [],
    };
  },
  mounted() {
  },
  methods: {
    onNav(keys) {
      this.$log.info('NEW NAV EVENT', keys)
      this.sub_categories = keys
    }
  },
  apollo: {
    config: {
      query: CONFIG_Q,
      fetchPolicy: 'cache-first',
      result(res) {
        this.$store.commit('setConfig', res.data.config.data.attributes)
      }
    },
    tags: {
      query: TAGS_Q,
      fetchPolicy: 'cache-first',
      result(res) {
        this.$store.commit('setTags', res.data.tags.data)
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

.footer {
  height: 80px;
}

.footer *, .headline *, .white_text {
  color: #ccc;
}

.footer a, .headline a {
  color: #4b83a4;
}

</style>
