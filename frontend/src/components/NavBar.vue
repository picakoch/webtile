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
            <li v-for="category in $store.getters.config?.categories" :key="category.id" class="nav-item">
              <RouterLink
                  :to="'/' + category.id "
                  :key="category.id "
                  :style="nav_styles(category.strapiId)"
              >
                {{ category.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import {TILE_COLORS} from "@/lib/constants";

export default {
  name: "NavBar",
  data() {
    return {
    };
  },
  methods: {
    nav_styles: function (cat_id) {
      return {
        '--border-color': TILE_COLORS[cat_id],
      }
    }
  },
};
</script>

<style scoped>
.uk-navbar-nav > li > a {
  font-size: 1.1em;
  font-weight: 900;
  color: white;
  padding-left: 10px;
  padding-right: 10px;
  border: 5px solid;
  border-color: #00000000;
}

.uk-navbar-nav > li > a:hover, .uk-navbar-nav > li > a:active {
  font-size: 1.1em;
  font-weight: 900;
  color: #ccc;
  border-color: var(--border-color);
}

.nav_text_main {
  font-size: 1.2em;
}

.nav-item{
  max-width: 200px;
}
</style>