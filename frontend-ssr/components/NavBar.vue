<template>
  <div>
    <div
      uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky"
      class="uk-background-cover"
      :style="`background-image: url(${
        backend_url +
        config?.banner?.data?.attributes?.formats
      }); height: 92px; width: 100%; opacity: 1`"
    >
      <nav
        class="uk-navbar-container uk-margin-small-right"
        uk-navbar="mode: click"
        style="background: none; height: 55px"
      >
        <div class="uk-navbar-left uk-margin-left">
          <ul class="uk-navbar-nav">
            <li>
              <NuxtLink to="/time" class="nav-text-main">
                <template v-if="config?.logo?.data?.attributes">
                  <img
                    class="logo"
                    :src="
                      backend_url +
                      config?.logo?.data?.attributes?.formats
                    "
                    :alt="config?.title"
                  />
                </template>
                <template v-else>
                  {{ config?.title }}
                </template>
              </NuxtLink>
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
              <NuxtLink
                :to="'/' + category.id"
                :key="'cat_' + category.id"
                :class="{ 'uk-active': isActiveCat(category) }"
              >
                {{ category.label }}
              </NuxtLink>
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

        <div class="uk-navbar-right uk-hidden@m uk-light" style="height: 92px">
          <ul class="uk-navbar-nav">
            <li>
              <a href="#"><span uk-icon="icon: menu"></span></a>
              <div
                class="uk-navbar-dropdown uk-background-secondary uk-light"
                ref="dropdown"
              >
                <ul class="uk-nav uk-navbar-dropdown-nav">
                  <li
                    v-for="category in mobile_categories"
                    :key="category.id"
                    class="nav-item"
                  >
                    <NuxtLink
                      :to="category.id"
                      v-if="category.id"
                      :key="'cat_' + category.id"
                      class="uk-navbar-dropdown-close"
                      @click="closeDropdown"
                      :class="{
                        'uk-active': isActive(category),
                      }"
                    >
                      {{ category.label }}
                    </NuxtLink>
                    <span v-else>
                      {{ category.label }}
                    </span>
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
        class="uk-navbar-container uk-margin-small-right"
        uk-navbar
        style="background: none; height: 30px"
      >
        <div
          class="uk-navbar-left uk-visible@m"
          v-if="config?.subtitle"
        >
          <ul class="uk-navbar-nav">
            <li class="nav-item nav-subtitle uk-margin-left">
              {{ config?.subtitle }}
              <template v-if="config?.subtitle_line2">
                <br />
                {{ config?.subtitle_line2 }}
              </template>
            </li>
          </ul>
        </div>
        <div
          class="nav-overlay uk-navbar-right uk-visible@m"
          v-if="
            $route.name === 'tag' ||
            $route.name === 'media' ||
            $route.name === 'main' ||
            $route.name === 'time' ||
            $route.name === 'main_type' ||
            $route.name === 'main_tag' ||
            $route.name === 'main_media' ||
            $route.name === 'bio' ||
            $route.name === 'contact'
          "
        >
          <ul
            v-if="sub_cats.length > 0 && !is_tag && !is_media"
            class="uk-navbar-nav uk-navbar-nav-level2 uk-navbar-spy"
            uk-scrollspy-nav="closest: li; scroll: true"
          >
            <li
              v-for="(sub_category, index) in sub_cats.slice(
                0,
                max_level2_elements
              )"
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
            v-if="sub_cats.length >= max_level2_elements && !is_tag"
          >
            <li>
              <a href="#"><span uk-icon="icon: more; ratio: 1.2"></span></a>
              <div class="uk-navbar-dropdown uk-light uk-background-secondary">
                <ul
                  class="uk-nav uk-navbar-dropdown-nav uk-navbar-spy"
                  uk-scrollspy-nav="closest: li; scroll: true"
                >
                  <li
                    v-for="(sub_category, index) in sub_cats.slice(
                      max_level2_elements
                    )"
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
            v-if="sub_cats.length > 0 && (is_tag || is_media)"
            class="uk-navbar-nav uk-navbar-nav-level2"
          >
            <li
              v-for="(sub_category, index) in sub_cats.slice(
                0,
                max_level2_elements
              )"
              :key="index"
              class="nav-item"
            >
              <NuxtLink
                :to="'/' + prefix + '/' + slugify(sub_category)"
                :key="'cat_' + slugify(sub_category)"
                :class="{
                  'uk-active': isActiveSubCat(sub_category),
                }"
              >
                {{ sub_category }}
              </NuxtLink>
            </li>
          </ul>
          <ul
            class="uk-navbar-nav nav-center uk-navbar-nav-level2"
            v-if="sub_cats.length >= max_level2_elements && is_tag"
          >
            <li>
              <a href="#"><span uk-icon="icon: more; ratio: 1.2"></span></a>
              <div class="uk-navbar-dropdown uk-light uk-background-secondary">
                <ul
                  class="uk-nav uk-navbar-dropdown-nav uk-navbar-spy"
                  uk-scrollspy-nav="closest: li; scroll: true"
                >
                  <li
                    v-for="(sub_category, index) in sub_cats.slice(
                      max_level2_elements
                    )"
                    :key="index"
                    class="nav-item"
                  >
                    <NuxtLink
                      :to="'/' + prefix + '/' + slugify(sub_category)"
                      :key="'cat_' + slugify(sub_category)"
                      :class="{
                        'uk-active': isActiveSubCat(sub_category),
                      }"
                    >
                      {{ sub_category }}
                    </NuxtLink>
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

<script setup>
import { slugify } from "~/utils/utils.js"
import uk from "uikit"
import {useAppStore} from "../stores/app.js";

const appStore = useAppStore()
const route = useRoute()
const router = useRouter()

const config = computed(() => appStore.config)
const backend_url = computed(() => appStore.backend_url)
const tags = computed(() => appStore.tags)
const media_enabled = computed(() => appStore.media_enabled)
const label_music = computed(() => appStore.label_music)
const label_video = computed(() => appStore.label_video)
const label_images = computed(() => appStore.label_images)
const label_text = computed(() => appStore.label_text)
const label_date = computed(() => appStore.label_date)
const label_theme = computed(() => appStore.label_theme)
const label_media = computed(() => appStore.label_media)
const label_bio = computed(() => appStore.label_bio)
const label_contact = computed(() => appStore.label_contact)

const emit = defineEmits(['search_tile', 'nav'])

const props = defineProps({
  sub_categories: {
    type: Array,
    default: () => [],
  },
})

const contact_subcat = ref([])
const media_subcat = ref([
  label_music.value,
  label_video.value,
  label_images.value,
  label_text.value,
])
const q = ref("")
const search_active = ref(false)
const sub_cats = ref([])
const is_tag = ref(false)
const is_media = ref(false)
const max_level2_elements = ref(20)
const dropdown = ref(null)

const prefix = computed(() => {
  return is_tag.value ? "t" : is_media.value ? "m" : ""
})

const categories = computed(() => {
  if (media_enabled.value) {
    return [
      { id: "time", label: label_date.value },
      { id: "tag", label: label_theme.value },
      { id: "media", label: label_media.value },
      { id: "bio", label: label_bio.value },
      { id: "contact", label: label_contact.value },
    ]
  } else {
    return [
      { id: "time", label: label_date.value },
      { id: "tag", label: label_theme.value },
      { id: "bio", label: label_bio.value },
      { id: "contact", label: label_contact.value },
    ]
  }
})

const mobile_categories = computed(() => {
  let cats = []
  if (media_enabled.value) {
    cats = [
      { id: "/time", label: label_date.value },
      { id: "/bio", label: label_bio.value },
      { id: "/contact", label: label_contact.value },
      { id: null, label: label_media.value },
      {
        id: "/m/" + slugify(label_music.value),
        label: label_music.value,
      },
      {
        id: "/m/" + slugify(label_video.value),
        label: label_video.value,
      },
      {
        id: "/m/" + slugify(label_images.value),
        label: label_images.value,
      },
      {
        id: "/m/" + slugify(label_text.value),
        label: label_text.value,
      },
      { id: null, label: label_theme.value },
    ]
  } else {
    cats = [
      { id: "/time", label: label_date.value },
      { id: "/bio", label: label_bio.value },
      { id: "/contact", label: label_contact.value },
      { id: null, label: label_theme.value },
    ]
  }
  tags?.value?.forEach((t) => {
    cats.push({
      id: "/t/" + slugify(t.attributes.name),
      label: t.attributes.name,
    })
  })

  return cats
})

const closeDropdown = () => {
  if (dropdown.value) {
    uk.dropdown(dropdown.value).hide()
  }
}

const isActive = (category) => {
  return (
    route.path === "/" + category.id ||
    (is_tag.value && category.id == "tag")
  )
}

const isActiveCat = (category) => {
  if (route.path === "/" + category.id) {
    return true
  }
  if (category.id === route.name) {
    return true
  }
  return false
}

const isActiveSubCat = (category) => {
  if (is_tag.value) {
    return route.params.tag === slugify(category)
  } else if (is_media.value) {
    return route.params.media === slugify(category)
  }
}

const doSearch = () => {
  if (q.value.length > 2) {
    emit("search_tile", q.value)
  }
}

const resetSearch = () => {
  q.value = ""
  search_active.value = false
  emit("search_tile", "")
}

const changeSubCats = () => {
  is_tag.value = false
  if (route.name === "contact") {
    sub_cats.value = contact_subcat.value
  } else if (route.name === "tag" || route.name == "t-tag") {
    is_tag.value = true
    sub_cats.value = tags.value.map((e) => e.attributes.name)
  } else if (
    route.name === "media" ||
    route.name == "m-media"
  ) {
    is_media.value = true
    sub_cats.value = media_subcat.value
  } else {
    sub_cats.value = props.sub_categories
  }
}

watch(() => route.path, () => {
  nextTick(() => {
    changeSubCats()
  })
})

watch(() => props.sub_categories, () => {
  changeSubCats()
})

onMounted(() => {
  changeSubCats()
})
</script>

<style scoped>
.uk-navbar-nav > li > a {
  font-size: 1.2em;
  font-weight: 600;
  color: #fff;
  padding-left: 10px;
  padding-right: 10px;
  text-underline-offset: 5px;
}

.uk-navbar-nav.nav-center > li > a {
  font-size: 1.2em;
  font-weight: 600;
  color: #fff;
  padding-left: 5px;
  padding-right: 5px;
  border: none;
}

.uk-navbar-nav > li > a:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
  color: #fff;
}

.uk-navbar-nav > li > .uk-active {
  color: #fff;
  text-decoration: underline;
}

.uk-navbar-nav > li.uk-active > a,
.uk-navbar-dropdown-nav > li.uk-active > a {
  text-decoration: underline;
  color: #fff;
}

.nav-text-main {
  font-size: 2.2em !important;
  text-align: left !important;
  font-family: Augustus, "Times New Roman", Times, sans-serif;
}

.nav-subtitle {
  font-size: 1.1em !important;
  text-align: left !important;
  max-width: 500px !important;
  color: #fff;
  padding-left: 10px;
}

.nav-item {
  max-width: 260px;
}

.nav-item > a {
  font-family: Augustus, "Times New Roman", Times, sans-serif;
}

.uk-search-input {
  color: #fff;
  font-size: 2em;
  font-family: "Times New Roman", Times, sans-serif;
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
  min-height: 30px;
  font-size: 0.8em;
}

.logo {
  max-height: 40px;
}
</style>