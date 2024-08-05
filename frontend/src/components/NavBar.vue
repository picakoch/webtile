<template>
  <div>
    <div
      uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky"
      class="uk-background-cover"
      :style="`background-image: url(${
        $store.getters.backend_url +
        $store.getters?.config?.banner?.data?.attributes?.formats
      }); height: 100px; width: 100%; opacity: 1`"
    >
      <nav
        class="uk-navbar-container"
        uk-navbar
        style="background: none; height: 55px"
      >
        <div class="uk-navbar-left uk-margin-left">
          <ul class="uk-navbar-nav">
            <li>
              <RouterLink to="/time" class="nav-text-main"
                >{{ $store.getters.config?.title }}
              </RouterLink>
            </li>
            <li style="width: 30px">&nbsp;</li>
          </ul>
        </div>

        <div class="nav-overlay uk-navbar-right uk-visible@m">
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
              <a
                class="uk-navbar-toggle"
                uk-search-icon
                uk-toggle="target: .nav-overlay; animation: uk-animation-fade"
                href="#"
              ></a>
            </li>
          </ul>
        </div>

        <div class="uk-navbar-right uk-hidden@m uk-light" style="height: 100px">
          <ul class="uk-navbar-nav">
            <li>
              <a href="#"><span uk-icon="icon: menu"></span></a>
              <div class="uk-navbar-dropdown uk-background-secondary uk-light">
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
                class="uk-navbar-toggle test"
                uk-search-icon
                v-show="!search_active"
                uk-toggle="target: .nav-overlay; animation: uk-animation-fade"
                @click="search_active = true"
                href="#"
              ></a>
            </li>
          </ul>
        </div>

        <div class="nav-overlay uk-navbar-left uk-flex-1" hidden>
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

      <nav
        class="uk-navbar-container"
        uk-navbar
        style="background: none; height: 30px"
      >
        <div
          class="nav-overlay uk-navbar-right uk-visible@m"
          v-if="$route.name === 'main' || $route.name === 'contact'"
        >
          <ul
            v-if="sub_cats.length > 0"
            class="uk-navbar-nav uk-navbar-nav-level2 uk-navbar-spy"
            uk-scrollspy-nav="closest: li; scroll: true"
          >
            <li
              v-for="(sub_category, index) in sub_cats.slice(0, 5)"
              :key="index"
              class="nav-item"
            >
              <a :href="`#tile_group_${sub_category}`" class="uk-light">
                {{ sub_category }}
              </a>
            </li>
          </ul>
          <ul
            class="uk-navbar-nav nav-center uk-navbar-nav-level2"
            v-if="sub_cats.length >= 5"
          >
            <li>
              <a href="#"><span uk-icon="icon: more; ratio: 1.2"></span></a>
              <div class="uk-navbar-dropdown uk-light uk-background-secondary">
                <ul
                  class="uk-nav uk-navbar-dropdown-nav uk-navbar-spy"
                  uk-scrollspy-nav="closest: li; scroll: true"
                >
                  <li
                    v-for="(sub_category, index) in sub_cats.slice(5)"
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
        { id: "time", label: this.$store.getters.label_date },
        { id: "theme", label: this.$store.getters.label_theme },
        { id: "type", label: this.$store.getters.label_media },
        { id: "bio", label: this.$store.getters.label_bio },
        { id: "contact", label: this.$store.getters.label_contact },
      ],
      contact_subcat: [
        this.$store.getters.label_newsletter,
        this.$store.getters.label_contacts,
      ],
      q: "",
      search_active: false,
      sub_cats: [],
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
      if (this.q.length > 2) {
        this.$emit("search_tile", this.q);
      }
    },
    resetSearch() {
      this.$log.debug("(navbar) reset search", this.q);
      this.q = "";
      this.search_active = false;
      this.$emit("search_tile", "");
    },
    changeSubCats() {
      if (this.$route.name === "contact") {
        this.sub_cats = this.contact_subcat;
      } else {
        this.sub_cats = this.sub_categories;
      }
    },
  },
  mounted() {
    if (this.$store.getters.support_enabled) {
      this.contact_subcat.push(this.$store.getters.label_support);
    }
    this.changeSubCats();
  },
  watch: {
    $route: function () {
      this.$nextTick(() => {
        this.changeSubCats();
      });
    },
    sub_categories: function () {
      this.changeSubCats();
    },
  },
};
</script>

<style scoped>
.uk-navbar-nav > li > a {
  font-size: 1.2em;
  font-weight: 600;
  color: #ccc;
  padding-left: 10px;
  padding-right: 10px;
  border-top: 4px solid #eee;
  border-color: #00000000;
}

.uk-navbar-nav.nav-center > li > a {
  font-size: 1.2em;
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

.uk-navbar-nav > li.uk-active > a,
.uk-navbar-dropdown-nav > li.uk-active > a {
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
  font-size: 2em;
}

.uk-search-navbar .uk-search-input {
  background: transparent;
}

.uk-search-navbar .uk-search-input:focus {
  background: transparent;
}

.uk-navbar-nav {
  font-size: 1.1em;
}

.uk-navbar-nav > li > a,
.uk-navbar-item,
.uk-navbar-toggle {
  min-height: 55px;
}

.uk-navbar-nav-level2 > li > a {
  min-height: 25px;
  font-size: 1em;
}
</style>
