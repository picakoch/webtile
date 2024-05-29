<template>
  <div>
    <div
      uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky"
      class="uk-background-cover"
      :style="`background-image: url(${
        $store.getters.backend_url +
        $store.getters.config.banner.data.attributes.formats
      }); height: 100px; width: 100%; opacity: 1`"
    >
      <nav
        class="uk-navbar-container"
        uk-navbar
        style="background: none; padding-top: 10px"
      >
        <div class="uk-navbar-left uk-margin-left" style="height: 100px;">
          <ul class="uk-navbar-nav">
            <li>
              <RouterLink to="/time" class="nav-text-main"
                >{{ $store.getters.config?.title }}
              </RouterLink>
            </li>
            <li style="width: 30px">
              &nbsp;
            </li>
          </ul>
        </div>
        <div class="nav-overlay uk-navbar-left uk-visible@m">
          <ul class="uk-navbar-nav nav-center" v-if="sub_categories.length >= 5">
            <li>
              <a href="#">{{ section }}</a>
              <div class="uk-navbar-dropdown uk-light uk-background-secondary">
                <ul
                  class="uk-nav uk-navbar-dropdown-nav uk-navbar-spy"
                  uk-scrollspy-nav="closest: li; scroll: true"
                >
                  <li
                    v-for="(sub_category, index) in sub_categories"
                    :key="index"
                    class="nav-item"
                  >
                    <a :href="`#tile_group_${sub_category}`" class="uk-light">
                      {{ sub_category }}
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <ul
            v-else-if="sub_categories.length > 0"
            class="uk-navbar-nav nav-center uk-navbar-spy"
            uk-scrollspy-nav="closest: li; scroll: true"
          >
            <li
              v-for="(sub_category, index) in sub_categories"
              :key="index"
              class="nav-item"
            >
              <a :href="`#tile_group_${sub_category}`" class="uk-light">
                {{ sub_category }}
              </a>
            </li>
          </ul>
        </div>

        <div class="nav-overlay uk-navbar-right uk-visible@m" style="height: 100px;">
          <ul class="uk-navbar-nav">
            <li
              v-for="category in categories"
              :key="category.id"
              class="nav-item"
            >
              <RouterLink
                :to="'/' + category.id"
                :key="'cat_' + category.id"
                :class="{ 'uk-active': $route.path === '/' + category.id }"
              >
                {{ category.label }}
              </RouterLink>
            </li>
            <li class="nav-item">
              <a href="#contact" uk-scroll> Contact </a>
            </li>
            <li class="nav-item">
              <a
                class="uk-navbar-toggle"
                uk-search-icon
                uk-toggle="target: .nav-overlay; animation: uk-animation-fade"
                href="#"
              ></a>
            </li>
          </ul>
        </div>

        <div class="uk-navbar-right uk-hidden@m" style="height: 100px;">
          <ul class="uk-navbar-nav">
            <li>
              <a href="#">...</a>
              <div class="uk-navbar-dropdown">
                <ul class="uk-nav uk-navbar-dropdown-nav">
                  <li
                    v-for="category in categories"
                    :key="category.id"
                    class="nav-item"
                  >
                    <RouterLink
                      :to="'/' + category.id"
                      :key="'cat_' + category.id"
                      :class="{
                        'uk-active': $route.path === '/' + category.id,
                      }"
                    >
                      {{ category.label }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <a
                class="uk-navbar-toggle"
                uk-search-icon
                uk-toggle="target: .nav-overlay; animation: uk-animation-fade"
                href="#"
              ></a>
            </li>
          </ul>
        </div>

        <div class="nav-overlay uk-navbar-left uk-flex-1" hidden style="height: 100px;">
          <div class="uk-navbar-item uk-width-expand">
            <form
              class="uk-search uk-search-navbar uk-width-1-1"
              @submit.prevent="doSearch"
            >
              <input
                v-model="q"
                class="uk-search-input"
                type="search"
                placeholder="Rechercher"
                aria-label="Rechercher"
                autofocus
              />
            </form>
          </div>

          <a
            class="uk-navbar-toggle"
            uk-close
            uk-toggle="target: .nav-overlay; animation: uk-animation-fade"
            href="#"
            @click="resetSearch"
          ></a>
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
        { id: "time", label: "Date" },
        { id: "theme", label: "Thème" },
        { id: "type", label: "Media" },
        { id: "newsletter", label: "Newsletter" },
        { id: "donate", label: "Soutenir" },
      ],
      section: "Aller à",
      q: "",
    };
  },
  props: {
    sub_categories: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    doSearch() {
      this.$log.debug("(navbar) Search", this.q);
      if (this.q.length > 2) {
        this.$emit("search_tile", this.q);
      }
    },
    resetSearch() {
      this.$log.debug("(navbar) reset search", this.q);
      this.q = "";
      this.$emit("search_tile", "");
    },
  },
  mounted() {},
};
</script>

<style scoped>
.uk-navbar-nav > li > a {
  font-size: 1.1em;
  font-weight: 600;
  color: #ccc;
  padding-left: 10px;
  padding-right: 10px;
  border-top: 4px solid #eee;
  border-color: #00000000;
}

.uk-navbar-nav.nav-center > li > a {
  font-size: 1.1em;
  font-weight: 600;
  color: #ccc;
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

.uk-navbar-nav > li.uk-active > a,.uk-navbar-dropdown-nav > li.uk-active > a{
  color: #fff;
}

.nav-text-main {
  font-size: 2.2em !important;
}

.nav-item {
  max-width: 200px;
}

.uk-search-input {
  color: #fff;
  font-size: 2.0em;
}

.uk-search-navbar .uk-search-input{
    background: transparent;
}

.uk-search-navbar .uk-search-input:focus{
    background: transparent;
}

.uk-navbar-nav{
  font-size: 1.1em;
}
</style>
