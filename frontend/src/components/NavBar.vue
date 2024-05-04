<template>
  <div>
    <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky" class="uk-background-cover"
         :style="`background-image: url(${$store.getters.backend_url + $store.getters.config.banner.data.attributes.formats}); height: 90px; width: 100%; opacity: 1`">
      <nav class="uk-navbar-container" uk-navbar style="background: none;">
        <div class="uk-navbar-left uk-margin-left">
          <ul class="uk-navbar-nav">
            <li>
              <RouterLink
                  to="/time"
                  class="nav-text-main"
              >{{ $store.getters.config?.title }}
              </RouterLink>
            </li>
          </ul>
        </div>
        <div class="uk-navbar-center">
          <ul class="uk-navbar-nav nav-center" v-if="sub_categories.length > 10">
            <li>
              <a href="#">{{ section }}</a>
              <div class="uk-navbar-dropdown uk-light uk-background-secondary">
                <ul class="uk-nav uk-navbar-dropdown-nav uk-navbar-spy" uk-scrollspy-nav="closest: li; scroll: true">
                  <li v-for="(sub_category, index) in sub_categories" :key="index" class="nav-item">
                    <a
                        :href="`#tile_group_${sub_category}`"
                        class="uk-light"
                    >
                      {{ sub_category }}
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <ul v-else-if="sub_categories.length > 0" class="uk-navbar-nav nav-center uk-navbar-spy"
              uk-scrollspy-nav="closest: li; scroll: true">
            <li v-for="(sub_category, index) in sub_categories" :key="index" class="nav-item">
              <a
                  :href="`#tile_group_${sub_category}`"
                  class="uk-light"
              >
                {{ sub_category }}
              </a>
            </li>
          </ul>
        </div>

        <div class="uk-navbar-right uk-margin-right">
          <ul class="uk-navbar-nav">
            <li v-for="category in categories" :key="category.id" class="nav-item">
              <RouterLink
                  :to="'/' + category.id "
                  :key="'cat_' + category.id "
                  :class="{ 'uk-active' : $route.path === '/' + category.id}"
              >
                {{ category.label }}
              </RouterLink>
            </li>
            <li class="nav-item">
              <a href="#contact" uk-scroll>
                Contact
              </a>
            </li>

          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import uk from "uikit";

export default {
  name: "NavBar",
  data() {
    return {
      categories: [
        {id: "time", label: "Par date"},
        {id: "theme", label: "Par thème"},
        {id: "type", label: "Par type"},
      ],
      section: 'Aller à',
    };
  },
  props: {
    sub_categories: {
      type: Array,
      default: () => []
    }
  },
  methods: {},
  mounted() {
    uk.util.on(document, 'active', '.uk-navbar-container', function (e) {
      console.log("ACTIVE", e.detail[1].id)
    });
  }
};
</script>

<style scoped>
.uk-navbar-nav > li > a {
  font-size: 1.1em;
  font-weight: 600;
  color: #ccc;
  padding-left: 10px;
  padding-right: 10px;
  border-top: 5px solid #ccc;
  border-color: #00000000;
}

.uk-navbar-nav.nav-center > li > a {
  font-size: 1.1em;
  font-weight: 600;
  color: #aaa;
  padding-left: 5px;
  padding-right: 5px;
  border: none;
}

.uk-navbar-nav > li > a:hover {
  color: #fff;
}

.uk-navbar-nav > li > .uk-active {
  border-color: #ccc;
  color: #fff;
}

.uk-navbar-nav > li.uk-active > a {
  color: #fff;
}

.nav-text-main {
  font-size: 2.2em !important;
}

.nav-item {
  max-width: 200px;
}
</style>