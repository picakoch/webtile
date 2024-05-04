<template>
  <div>
    <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky" class="uk-background-cover"
         :style="`background-image: url(${$store.getters.backend_url + $store.getters.config.banner.data.attributes.formats}); height: 100px; width: 100%; opacity: 1`">
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

        <div class="uk-navbar-right uk-margin-right">
          <ul class="uk-navbar-nav">
            <li v-if="sub_categories.length > 0">
              <a href="#">Aller ...</a>
              <div class="uk-navbar-dropdown uk-light uk-background-secondary">
                <ul class="uk-nav uk-navbar-dropdown-nav">
                  <li v-for="(sub_category, index) in sub_categories" :key="index" class="nav-item">
                    <a
                        :href="`#tile_group_${sub_category}`"
                        uk-scroll="offset: 10"
                    >
                      {{ sub_category }}
                    </a>
                  </li>
                </ul>
              </div>
            </li>


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
export default {
  name: "NavBar",
  data() {
    return {
      categories: [
        {id: "time", label: "Chronologique"},
        {id: "theme", label: "Thématique"}
      ],
    };
  },
  props: {
    sub_categories: {
      type: Array,
      default: () => []
    }
  },
  methods: {},
};
</script>

<style scoped>
.uk-navbar-nav > li > a {
  font-size: 1.1em;
  font-weight: 600;
  color: #ccc;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 5px solid #ccc;
  border-color: #00000000;
}

.uk-navbar-nav > li > a:hover {
  color: #fff;
}

.uk-navbar-nav > li > .uk-active {
  border-color: #ccc;
}

.nav-text-main {
  font-size: 2.2em !important;
}

.nav-item {
  max-width: 200px;
}
</style>