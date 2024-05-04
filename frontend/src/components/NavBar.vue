<template>
  <div>
    <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky" class="uk-background-cover"
         :style="`background-image: url(${$store.getters.backend_url + $store.getters.config.banner.data.attributes.formats}); height: 90px; width: 100%; opacity: 1`">
      <nav class="uk-navbar-container" uk-navbar style="background: none;">
        <div class="uk-navbar-left uk-margin-left">
          <ul class="uk-navbar-nav">
            <li>
              <RouterLink
                  to="/all"
                  class="nav_text_main"
              >{{ $store.getters.config?.title }}
              </RouterLink>
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
            <li v-for="sub_category in sub_categories" :key="category.id" class="nav-item">
              <a
                  :href="`#${sub_category.id}`"
                  :key="'subcat_' + category.id "
                  :class="{ 'uk-active' : $route.path === '/' + category.id}"
              >
                AAA
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
      sub_categories: [
      ]
    };
  },
  methods: {},
};
</script>

<style scoped>
.uk-navbar-nav > li > a {
  font-size: 1.1em;
  font-weight: 600;
  color: white;
  padding-left: 10px;
  padding-right: 10px;
  border: 5px solid white;
  border-color: #00000000;
}

.uk-navbar-nav > li > a:hover {
  color: #ccc;
}

.uk-navbar-nav > li > .uk-active {
  border-color: #ffffff;
}

.nav_text_main {
  font-size: 2.2em !important;
}

.nav-item {
  max-width: 200px;
}
</style>