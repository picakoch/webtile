<template>
  <div v-if="$apollo.loading" class="uk-position-center">
    <div class="spinner uk-margin-top" uk-spinner="ratio: 3"></div>
  </div>
  <template v-else>
    <NavBar :sub_categories="sub_categories" @search_tile="onSearch" />
    <div
      uk-alert
      style="border: 8px #ccc solid"
      class="uk-margin-top uk-margin-left uk-margin-right headline uk-background-secondary"
      v-if="
        $store.getters.config?.headline &&
        !$store.getters.headline_as_tile &&
        this.$store.getters.headline_enabled
      "
    >
      <a href class="uk-alert-close" uk-close></a>
      <StrapiBlocks :content="$store.getters.config.headline"></StrapiBlocks>
    </div>
    <router-view @nav="onNav" :q="q"></router-view>
    <hr class="uk-divider-icon" />

    <div class="uk-width-1-1 uk-margin-top footer uk-text-center" id="contact">
      <div v-if="$store.getters.config?.contacts">
        {{ $store.getters.config.contact_footer }}
      </div>
      <div class="uk-text-muted">
        design/dev <a target="_blank" href="https://www.n21.fr">N21</a> |
        <a target="_blank" href="https://github.com/picakoch/webtile"
          >webtile</a
        >
      </div>
    </div>
  </template>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import { CONFIG_Q, TAGS_Q } from "@/lib/queries";
import { StrapiBlocks } from "vue-strapi-blocks-renderer";

export default {
  name: "App",
  metaInfo() {
    const title = this.$store.getters.config.title;
    return {
      title: () => `${title}`,
      titleTemplate: null,
    };
  },
  components: {
    NavBar,
    StrapiBlocks,
  },
  data() {
    return {
      config: null,
      sub_categories: [],
      q: "",
    };
  },
  mounted() {
    this.$log.debug(this.$store.getters.headline_as_tile);
    this.$log.debug(this.$store.getters.headers_as_tile);
  },
  methods: {
    onNav(keys) {
      this.sub_categories = keys;
    },
    onSearch(q) {
      this.$log.debug("(App) DO SEARCH", q, this.q);
      this.q = q;
    },
  },
  apollo: {
    config: {
      query: CONFIG_Q,
      fetchPolicy: "cache-first",
      result(res) {
        this.$store.commit("setConfig", res.data.config?.data?.attributes);
        this.$nextTick(() => {
          document.title = this.$store.getters.config?.title;
        });
      },
    },
    tags: {
      query: TAGS_Q,
      fetchPolicy: "cache-first",
      result(res) {
        this.$store.commit("setTags", res.data.tags.data);
      },
    },
  },
};
</script>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@import "../node_modules/uikit/src/less/uikit.less";
@import "theme.less";

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

.footer *,
.headline *,
.white_text {
  color: #ccc;
}

.tile-preview {
  color: #eee;
}

.grid-sizer,
.grid-item--width1 {
  width: 93%;
}

.grid-sizer2,
.grid-item--width2 {
  width: 93%;
}

.gutter-sizer {
  width: 2%;
}

@media screen and (min-width: 700px) {
  // 2 columns
  .gutter-sizer {
    width: 3%;
  }

  .grid-sizer,
  .grid-item--width1 {
    width: 46%;
  }

  .grid-sizer2,
  .grid-item--width2 {
    width: 95%;
  }
}

@media screen and (min-width: 950px) {
  .gutter-sizer {
    width: 2%;
  }

  .grid-sizer,
  .grid-item--width1 {
    width: 31%;
  }

  .grid-sizer2,
  .grid-item--width2 {
    width: 64%;
  }
}

@media screen and (min-width: 1200px) {
  .gutter-sizer {
    width: 1.5%;
  }

  .grid-sizer,
  .grid-item--width1 {
    width: 23.2%;
  }

  .grid-sizer2,
  .grid-item--width2 {
    width: 47.9%;
  }
}

@media screen and (min-width: 1600px) {
  .gutter-sizer {
    width: 1%;
  }

  .grid-sizer,
  .grid-item--width1 {
    width: 18.8%;
  }

  .grid-sizer2,
  .grid-item--width2 {
    width: 39%;
  }
}

.grid-item {
  margin-bottom: 18px;
}
.tile-preview > img.img_border {
  border: 8px solid #eee;
}

.tile_border {
  position: relative;
  border: solid 8px #eee;
}

/* Hide scrollbar for Chrome, Safari and Opera */
*::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
* {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

h1,
h2,
h3,
h4 {
  font-family: Augustus, "Times New Roman", Times, sans-serif !important;
}

.main-title {
  color: #fff;
}
p {
  margin-top: 5px !important;
  margin-bottom: 5px !important;
}
</style>
